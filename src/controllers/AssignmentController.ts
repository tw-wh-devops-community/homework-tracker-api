import { Assignment, AssignmentModel } from '../models/Assignment'
import { Interviewer } from '../models/Interviewer'
import { Homework } from '../models/Homework'
import { AssignmentDTO } from '../dto/Assignment'
import { mapAssignmentItem } from '../helpers/AssignmentModel2DTOMapper'

const getAssignmentItem = async (assignment) => {
  const homework = await Homework.findOne({_id: assignment.homework_id})
  const interviewer = await Interviewer.findOne({_id: assignment.interviewer_id})
  return mapAssignmentItem(homework, interviewer, assignment)
}

export const getAssignments = async (req, res) => {
  const assignments: AssignmentModel[] = await Assignment.find({}).exec()
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
  const assignment = {
    finished_date: new Date(data.finished_date),
    is_finished: data.is_finished,
  }
  await Assignment.findByIdAndUpdate(data.id, assignment)
  res.sendStatus(204)
}
