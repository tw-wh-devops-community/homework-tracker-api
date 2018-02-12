export interface AssignmentDTO {
  id: string,
  candidate: string,
  job_role: string,
  interviewer_employee_id: string,
  interviewer_name: string,
  interviewer_profile: string,
  assigned_date: Date,
  deadline_date: Date,
  finished_date: Date,
  is_finished: boolean,
  status: string
}
