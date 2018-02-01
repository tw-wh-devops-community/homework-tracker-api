import ReviewStatus from '../models/ReviewStatus'

const mapHomeworkItem = ({_id, name, job_role}) => {
  return {
    id: _id,
    candidate: name,
    job_role,
  }
}

const mapInterviewerItem = ({_id, name, role, employee_id}) => {
  return {
    id: _id,
    name,
    role,
    employee_id,
  }
}

export const mapAssignmentItem = (homework, interviewer, assignment) => {
  const status = assignment.is_finished ?
    ReviewStatus.finished :
    new Date() < new Date(assignment.deadline_date) ? ReviewStatus.ongoing : ReviewStatus.overdue

  return {
    id: assignment._id,
    homework: mapHomeworkItem(homework),
    interviewer: mapInterviewerItem(interviewer),
    assigned_date: assignment.assigned_date,
    deadline_date: assignment.deadline_date,
    finished_date: assignment.finished_date,
    status,
  }
}
