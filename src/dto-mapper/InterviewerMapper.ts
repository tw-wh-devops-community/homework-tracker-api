import * as _ from 'lodash'
import { InterviewerModel } from '../models/Interviewer'
import { InterviewerDTO } from '../dto/Interviewer'

export const mapInterviewers = (interviewers): InterviewerDTO[] => (
  interviewers.map((interviewer: InterviewerModel) => {
    const model = _.pick(interviewer, ['_id', 'name', 'role', 'employee_id'])
    const result = {
      ...model,
      id: interviewer._id,
      profile: interviewer.getPicUrl(),
    }
    delete result._id
    return result
  })
)
