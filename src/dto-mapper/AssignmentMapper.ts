import * as _ from 'lodash'
import getDTOFromModel from '../helpers/DTOMapperHelper'
import { AssignmentModel } from '../models/Assignment'
import { AssignmentDTO } from '../dto/Assignment'
import { InterviewerModel } from '../models/Interviewer'

export const mapAssignment = (homework, interviewer: InterviewerModel, assignment: AssignmentModel) => {
  const model = getDTOFromModel(assignment,
    ['assigned_date', 'deadline_date', 'finished_date', 'is_finished'])
  const referenceProperties = {
    candidate: homework.name,
    job_role: homework.job_role,
    interviewer_employee_id: interviewer.employee_id,
    interviewer_name: interviewer.name,
    interviewer_profile: interviewer.getPicUrl(),
    status: assignment.getStatus(),
  }
  return _.merge(model, referenceProperties) as AssignmentDTO
}
