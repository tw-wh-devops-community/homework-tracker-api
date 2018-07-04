import { Assignment, AssignmentModel } from '../models/Assignment'
import { Interviewer, InterviewerModel } from '../models/Interviewer'
import { Homework, HomeworkModel } from '../models/Homework'
import { AssignmentDTO } from '../dto/Assignment'
import { mapAssignment } from '../dto-mapper/AssignmentMapper'
import { AssignmentOperateLog, AssignmentOperateLogModel } from '../models/AssignmentOperateLog'
import { AssignmentOperateAction } from '../models/AssignmentOperateAction'
import { sendNotify } from '../services/NotifyService'
import NotifyTemplates from '../services/NotifyTemplates'
import { dateFormat, fromNow } from '../utlis/dateFormat'
import {groupBy, minBy, keys } from 'lodash'

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
    return
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

    // Send notification
    const arg = {
        interviewer: interviewer.name,
        candidateName: homework.name,
        jobRole: homework.job_role,
        assignedDate: dateFormat(data.assignedDate),
        deadlineDate: dateFormat(data.deadlineDate),
    }

    sendNotify(interviewer.getMarkName(), NotifyTemplates.getNewHomeworkTemplate(arg), '1').then(() => {
        console.log(`send new homework notify to ${interviewer.name} success`)
    }).catch((err) => {
        console.log(`send new homework notify to ${interviewer.name} failed`, err)
    })
  })

  res.status(201).json({ message: 'create Successful' })
}

export const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id
    const assignment: AssignmentModel = await Assignment.findById(assignmentId).exec()
    if (assignment == null) {
        res.status(404).json({ message: `can not find assignment by id:${assignmentId}` })
        return
    }

    await Assignment.remove({ _id: assignmentId }).exec()

    // Send notification
    const interviewer: InterviewerModel = await Interviewer.findById(assignment.interviewer_id).exec()
    const homework: HomeworkModel = await Homework.findById(assignment.homework_id).exec()
    const arg = {
          interviewer: interviewer.name,
          candidateName: homework.name,
    }
    sendNotify(interviewer.getMarkName(), NotifyTemplates.getDeleteHomeworkTemplate(arg), '1').then(() => {
        console.log(`delete homework notify to ${interviewer.name} success`)
    }).catch((err) => {
        console.log(`delete homework notify to ${interviewer.name} failed`, err)
    })

    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

const sendUpdateInterviewerNotify = async (oldAssignment, homework, interviewer) => {
  const oldInterviewer = await Interviewer.findOne({ _id: oldAssignment.interviewer_id })
  const oldInterviewerTemplate = {
    interviewer: oldInterviewer.name,
    candidateName: homework.name,
    interviewer2: interviewer.name
  }
  const oldInterviewerMessage = NotifyTemplates.getUpdateInterviewerTemplate(oldInterviewerTemplate)
  sendNotify(oldInterviewer.getMarkName(), oldInterviewerMessage, '1').then(() => {
      console.log(`notify success`)
  }).catch((err) => {
      console.log(`notify failed`, err)
  })

  const interviewerTemplate = {
    interviewer: interviewer.name,
    candidateName: homework.name,
    jobRole: homework.job_role,
    assignedDate: oldAssignment.assigned_date.toLocaleString(),
    deadlineDate: oldAssignment.deadline_date.toLocaleString()
  }
  const message = NotifyTemplates.getNewHomeworkTemplate(interviewerTemplate)
  sendNotify(interviewer.getMarkName(), message, '1').then(() => {
      console.log(`notify success`)
  })
  .catch((err) => {
      console.log(`notify failed`, err)
  })
}

const sendUpdateDeadlineNotify = async (oldAssignment, homework, data) => {
  const oldInterviewer = await Interviewer.findOne({ _id: oldAssignment.interviewer_id })
  const templateData = {
    interviewer: oldInterviewer.name,
    candidateName: homework.name,
    deadlineDate: data.deadline_date
  }
  const message = NotifyTemplates.getUpdateDeadlineTemplate(templateData)
  sendNotify(oldInterviewer.getMarkName(), message, '1').then(() => {
      console.log(`notify success`)
  }).catch((err) => {
      console.log(`notify failed`, err)
  })
}

const sendCompleteHomeworkNotify = async (oldAssignment, homework, data) => {
  const oldInterviewer = await Interviewer.findOne({ _id: oldAssignment.interviewer_id })
  const templateData = {
    interviewer: oldInterviewer.name,
    candidateName: homework.name,
    completeDate: data.finished_date as string,
    assignedDate: oldAssignment.assigned_date.toLocaleString(),
    deadlineDate: oldAssignment.deadline_date.toLocaleString()
  }
  const message = NotifyTemplates.getCompleteHomeworkTemplate(templateData)
  sendNotify(oldInterviewer.getMarkName(), message, '1').then(() => {
      console.log(`notify success`)
  }).catch((err) => {
      console.log(`notify failed`, err)
  })
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

  // 通知
  let homework = await Homework.findOne({ _id: oldAssignment.homework_id })
  if (isUpdateFinished) {
    sendCompleteHomeworkNotify(oldAssignment, homework, data)
  }
  if (isUpdateDeadLineDate) {
    sendUpdateDeadlineNotify(oldAssignment, homework, data)
  }
  if (isUpdateInterviewer) {
    sendUpdateInterviewerNotify(oldAssignment, homework, interviewer)
  }
  res.sendStatus(204)
}

export const notifyUnfinshTask = async () => {
    const assignMents: AssignmentModel[] = await Assignment.find({ is_finished: false }).exec()
    const taksgroup = groupBy(assignMents, (it) => it.interviewer_id)
    keys(taksgroup).forEach(async (interviewId) => {
      const interviewer: InterviewerModel = await Interviewer.findById(interviewId).exec()
      const assigns = taksgroup[interviewId]
      const minAssignMent = minBy(assigns, (it: AssignmentModel) => it.deadline_date.getTime()) as AssignmentModel
      const args = {
          interviewer: interviewer.name,
          leftNum: assigns.length,
          leftTime: fromNow(minAssignMent.deadline_date),
      }
      sendNotify(interviewer.getMarkName(), NotifyTemplates.getHomeworkLeftTimeTemplate(args), '1').then(() => {
          console.log(`sendNotify success`)
      }).catch((err) => {
          console.log(`sendNotify failed`)
      })
    })
}