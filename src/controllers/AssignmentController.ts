import { Assignment, AssignmentModel } from '../models/Assignment'
import { Interviewer } from '../models/Interviewer'
import { Homework } from '../models/Homework'
import { AssignmentDTO } from '../dto/Assignment'
import { mapAssignment } from '../dto-mapper/AssignmentMapper'

const getAssignmentItem = async (assignment) => {
  const homework = await Homework.findOne({_id: assignment.homework_id})
  const interviewer = await Interviewer.findOne({_id: assignment.interviewer_id})
  return mapAssignment(homework, interviewer, assignment)
}

export const getAssignments = async (req, res) => {
  const assignments: AssignmentModel[] = await Assignment
    .find({})
    .sort({'is_finished': 1, 'deadline_date': 1, 'assigned_date': 1})
    .exec()
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
  const homework = new Homework({name: data.candidateName, job_role: data.jobRole})
  const savedHomework = await homework.save()
  const interviewers = await Interviewer.find({'employee_id': {$in: data.interviewerIds}})

  if (interviewers.length === 0) {
    res.status(400).json({message: 'bad request, please check the homework interviewers'})
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
    await assignment.save()
  })

  res.status(201).json({message: 'create Successful'})
}

export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.remove({_id: req.params.id}).exec()
    res.json({message: 'deleted'})
  } catch (err) {
    res.status(404).json({error: err})
  }
}

export const updateAssignment = async (req, res) => {
  const data = req.body
  const assignment = {}

  if (data.finished_date) {
    assignment.finished_date = new Date(data.finished_date)
    assignment.is_finished = data.is_finished
  }

  if (data.assigned_date) {
    assignment.assigned_date = new Date(data.assigned_date)
  }

  if (data.deadline_date) {
    assignment.deadline_date = new Date(data.deadline_date)
  }
  if (data.interviewer_employee_id) {
    const interviewer = await Interviewer.findOne({'employee_id': data.interviewer_employee_id})
    assignment.interviewer_id = interviewer
  }
  await Assignment.findByIdAndUpdate(data.id, assignment)
  res.sendStatus(204)
}
