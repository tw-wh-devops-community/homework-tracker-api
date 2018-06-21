import { InterviewerModel } from '../models/Interviewer'
import { InterviewerDTO } from '../dto/Interviewer'
import getDTOFromModel from '../helpers/DTOMapperHelper'
import getDTOFromModelWithOpenId from '../helpers/DTOMapperOpenIdHelper'
import { InterviewopenidDTO } from '../dto/InterviewopenidDTO'

export const mapInterviewer = (interviewer) => getDTOFromModel(interviewer, ['name', 'role', 'employee_id'])

export const mapInterviewers = (interviewers): InterviewerDTO[] => (
  interviewers.map((interviewer: InterviewerModel) => mapInterviewer(interviewer))
)

export const mapInterviewersopenid = (interviewers): InterviewopenidDTO[] => (
  interviewers.map((interviewer: InterviewerModel) => mapInterviewerOpenId(interviewer))
)

export const mapInterviewerOpenId = (interviewer) => getDTOFromModelWithOpenId(interviewer,
   ['name', 'role', 'employee_id'])
