import { InterviewerModel, Interviewer } from '../models/Interviewer'
import { InterviewerDTO } from '../dto/Interviewer'
import { mapInterviewers } from '../dto-mapper/InterviewerMapper'

export const getInterviewers = async (req, res) => {
  try {
    const interviewers: InterviewerModel[] = await Interviewer
      .find({})
      .sort({ pinyin_name: 1 }).exec()
    const interviewersJson: InterviewerDTO[] = mapInterviewers(interviewers)
    res.json(interviewersJson)
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const createInterviewers = async (req, res) => {
  const data = req.body

  const employee = await Interviewer.findOne({ 'employee_id': data.employeeId })

  if (employee != null) {
    res.status(400).json({ message: 'repeat employee id' })
  }

  const interviewerModel = await Interviewer.findOne({ 'name': data.name, 'role': data.jobRole })

  if (interviewerModel != null) {
    res.status(400).json({ message: 'repeat name and role' })
  }

  const interviewer = new Interviewer({ name: data.name, role: data.jobRole, employee_id: data.employeeId })
  await interviewer.save()
  res.status(201).json({ message: 'create Successful' })
}
