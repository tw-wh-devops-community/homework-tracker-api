const mapHomeworkItem = ({_id, name, job_role}) => {
  return {
    id: _id,
    name,
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
  return {
    id: assignment._id,
    homework: mapHomeworkItem(homework),
    interviewer: mapInterviewerItem(interviewer),
    assigned_date: assignment.assigned_date,
    deadline_date: assignment.deadline_date,
    finished_date: assignment.finished_date,
    is_finished: assignment.is_finished,
  }
}
