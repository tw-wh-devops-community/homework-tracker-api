import ReviewStatus from '../models/ReviewStatus'

export const mapAssignmentItem = (homework, interviewer, assignment) => {
  const status = assignment.is_finished ?
    ReviewStatus.finished :
    new Date() < new Date(assignment.deadline_date) ? ReviewStatus.ongoing : ReviewStatus.overdue

  return {
    id: assignment._id,
    candidate: homework.name,
    job_role: homework.job_role,
    interviewer_employee_id: interviewer.employee_id,
    interviewer_name: interviewer.name,
    assigned_date: assignment.assigned_date,
    deadline_date: assignment.deadline_date,
    finished_date: assignment.finished_date,
    is_finished: assignment.is_finished,
    status,
  }
}
