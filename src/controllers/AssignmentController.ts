import { Assignment, AssignmentModel } from '../models/Assignment'
import { Interviewer } from '../models/Interviewer'
import { Homework } from '../models/Homework'
import { AssignmentDTO } from '../dto/Assignment'
import { mapAssignment } from '../dto-mapper/AssignmentMapper'
import { AssignmentOperateLog, AssignmentOperateLogModel } from '../models/AssignmentOperateLog'
import { AssignmentOperateAction } from '../models/AssignmentOperateAction'
import NotifyServices from '../services/NotifyService'
import NotifyTemplates from '../services/NotifyTemplates'

const getAssignmentItem = async (assignment) => {
  const homework = await Homework.findOne({ _id: assignment.homework_id })
  const interviewer = await Interviewer.findOne({ _id: assignment.interviewer_id })
  return mapAssignment(homework, interviewer, assignment)
}

export const getAssignments = async (req, res) => {
  const finishedAssignments: AssignmentModel[] = await Assignment
    .find({ is_finished: true })
    .sort({ 'assigned_date': 1 })
    .exec()
  const ongoingAssignments: AssignmentModel[] = await Assignment
    .find({ is_finished: false, deadline_date: { $gte: new Date() } })
    .sort({ 'assigned_date': 1 })
    .exec()
  const overdueAssignments: AssignmentModel[] = await Assignment
    .find({ is_finished: false, deadline_date: { $lt: new Date() } })
    .sort({ 'assigned_date': 1 })
    .exec()
  const assignments = overdueAssignments.concat(ongoingAssignments).concat(finishedAssignments)
  const resultList: AssignmentDTO[] = await Promise.all(assignments.map(getAssignmentItem))

  res.json(resultList)
}

export const getAssignment = async (req, res) => {
  const assignment: AssignmentModel = await Assignment.findById(req.params.id).exec()
  const result: AssignmentDTO = await getAssignmentItem(assignment)

  res.json(result)
}

export const createAssignments = async (req, res) => {
  const data = req.body
  const homework = new Homework({ name: data.candidateName, job_role: data.jobRole })
  const savedHomework = await homework.save()
  const interviewers = await Interviewer.find({ 'employee_id': { $in: data.interviewerIds } })

  if (interviewers.length === 0) {
    res.status(400).json({ message: 'bad request, please check the homework interviewers' })
  }

  interviewers.forEach(async (interviewer) => {
    const assignment = new Assignment({
      assigned_date: new Date(data.assignedDate),
      deadline_date: new Date(data.deadlineDate),
      finished_date: null,
      is_finished: false,
      interviewer_id: interviewer,
      homework_id: savedHomework,
    })
    const saveAssignment = await assignment.save()
    const assignmentOperateLog = new AssignmentOperateLog({
      assignment_id: saveAssignment,
      operate_action: AssignmentOperateAction.ADD,
      operate_context: '新增作业记录',
      operate_time: new Date(data.assignedDate),
    })
    await assignmentOperateLog.save()
  })

  const result = await Promise.all(interviewers.map(interviewer => {
    console.log('interviewer', interviewer);
    const wxId = `${interviewer.name}${interviewer.employee_id}`
    return [1, 2, 3]
  }))
  console.log(result)
  // const notifyResult = await NotifyServices.sendNewHomeworkNotify('胡红翔', 'hello world ssssss', '1')
  // if (notifyResult.code === '0000') {
  //   res.status(201).json({ message: 'create Successful' })
  // } else {
  //   res.sendStatus(500).json({ message: 'send delete notify error' })
  // }
  res.status(201).json({ message: 'create Successful' })
}

export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.remove({ _id: req.params.id }).exec()
    const notifyResult = await NotifyServices.sendDeleteHomeworkNotify('胡红翔', 'hello world ssssss', '1')
    if (notifyResult.code === '0000') {
      res.json({ message: 'deleted' })
    } else {
      res.sendStatus(500).json({ message: 'send delete notify error' })
    }
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

export const updateAssignment = async (req, res) => {
  const data = req.body
  const assignment: any = {}
  let isUpdateAssignedDate = false
  let isUpdateDeadLineDate = false
  let isUpdateInterviewer = false
  let isUpdateFinished = false

  if (data.finished_date) { // 完成了任务
    assignment.finished_date = new Date(data.finished_date)
    assignment.is_finished = data.is_finished
    isUpdateFinished = true
  }

  if (data.assigned_date) { // 修改了分配时间
    assignment.assigned_date = new Date(data.assigned_date)
    isUpdateAssignedDate = true
  }

  if (data.deadline_date) { // 修改了截止时间
    assignment.deadline_date = new Date(data.deadline_date)
    isUpdateDeadLineDate = true
  }
  let interviewer
  if (data.interviewer_employee_id) {
    interviewer = await Interviewer.findOne({ 'employee_id': data.interviewer_employee_id })
    assignment.interviewer_id = interviewer
    isUpdateInterviewer = true
  }
  const oldAssignment = await Assignment.findByIdAndUpdate(data.id, assignment)
  let operateContext = ''
  if (isUpdateAssignedDate) {
    operateContext +=
      `修改分配时间“${oldAssignment.assigned_date.toLocaleString()}”为“${new Date(data.assigned_date).toLocaleString()}”|`
  }
  if (isUpdateDeadLineDate) {
    operateContext +=
      `修改截止时间“${oldAssignment.deadline_date.toLocaleString()}”为“${new Date(data.deadline_date).toLocaleString()}”|`
  }
  if (isUpdateInterviewer) {
    const oldInterviewer = await Interviewer.findById(oldAssignment.interviewer_id)
    operateContext += `修改面试官“${oldInterviewer.name}”为“${interviewer.name}”|`
  }
  if (isUpdateFinished) {
    operateContext += `修改状态为“完成”`
  }
  if (operateContext.endsWith('|')) {
    operateContext = operateContext.substring(0, operateContext.length - 1)
  }
  const assignmentOperateLog = new AssignmentOperateLog({
    assignment_id: oldAssignment,
    operate_action: AssignmentOperateAction.UPDATE,
    operate_context: operateContext,
    operate_time: new Date(),
  })
  await assignmentOperateLog.save()

  let sendNotify
  if (isUpdateFinished) {
    sendNotify = NotifyServices.sendCompleteHomeworkNotify
  }
  if (isUpdateDeadLineDate) {
    sendNotify = NotifyServices.sendUpdateDeadlineNotify
  }
  if (isUpdateInterviewer) {
    sendNotify = NotifyServices.sendUpdateInterviewerNotify
  }

  const notifyResult = await sendNotify('胡红翔', 'hello world ssssss', '1')
  if (notifyResult.code === '0000') {
    res.sendStatus(204)
  } else {
    res.sendStatus(500).json({ message: 'send notify error' })
  }
}
