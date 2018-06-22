import * as _ from 'lodash'
import { InterviewerDTO } from '../dto/Interviewer'
import getDTOFromModel from '../helpers/DTOMapperHelper'

export const mapInterviewer = (interviewer, openIdModel) => {
  const model = getDTOFromModel(interviewer, ['name', 'role', 'employee_id'])

  console.log('before')
  if (openIdModel == null) {
    return model as InterviewerDTO
  }

  console.log('after')
  const openIdProperties = {
    'open_id': openIdModel.open_id,
    '_openids_id': openIdModel._id,
  }

  return _.merge(model, openIdProperties) as InterviewerDTO
}
