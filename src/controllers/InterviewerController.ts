import { Interviewer, InterviewerModel } from '../models/Interviewer'
import { InterviewerDTO } from '../dto/Interviewer'
import { mapInterviewers } from '../dto-mapper/InterviewerMapper'

export const getInterviewers = async (req, res) => {
  try {
    const interviewers: InterviewerModel[] = await Interviewer.find({}).exec()
    const interviewersJson: InterviewerDTO[] = mapInterviewers(interviewers)
    res.json(interviewersJson)
  } catch (error) {
    res.status(400).json({ error })
  }
}
