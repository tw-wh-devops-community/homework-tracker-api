import { InterviewerModel } from '../models/Interviewer'
import { InterviewerDTO } from '../dto/Interviewer'
import getDTOFromModel from '../helpers/DTOMapperHelper'

export const mapInterviewer = (interviewer) => getDTOFromModel(interviewer, ['name', 'role', 'employee_id'])

export const mapInterviewers = (interviewers): InterviewerDTO[] => (
  interviewers.map((interviewer: InterviewerModel) => mapInterviewer(interviewer))
)
