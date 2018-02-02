import * as _ from 'lodash'
import ReviewStatus from '../models/ReviewStatus'
import getDTOFromModel from '../helpers/DTOMapperHelper'
import { AssignmentModel } from '../models/Assignment'
import { AssignmentDTO } from '../dto/Assignment'
import { InterviewerModel } from '../models/Interviewer'

const getReviewStatus = (assignment: AssignmentModel): string => {
  const { is_finished, deadline_date } = assignment
  if (is_finished) {
    return ReviewStatus.finished
  }
  return new Date() < new Date(deadline_date) ? ReviewStatus.ongoing : ReviewStatus.overdue
}

export const mapAssignment = (homework, interviewer: InterviewerModel, assignment) => {
  const status = getReviewStatus(assignment)
  const model = getDTOFromModel(assignment,
    ['assigned_date', 'deadline_date', 'finished_date', 'is_finished'])
  const referenceProperties = {
    candidate: homework.name,
    job_role: homework.job_role,
    interviewer_employee_id: interviewer.employee_id,
    interviewer_name: interviewer.name,
    interviewer_profile: interviewer.getPicUrl(),
    status,
  }
  return _.merge(model, referenceProperties) as AssignmentDTO
}
