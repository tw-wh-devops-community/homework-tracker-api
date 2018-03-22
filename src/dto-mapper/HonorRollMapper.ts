import { HonorRollDTO } from '../dto/HonorRollDTO'
import { InterviewerModel } from '../models/Interviewer'

const getHours = (milliseconds: number): number => {
  return Number.parseFloat((milliseconds / ( 1000 * 60 * 60)).toFixed(2))
}

export const mapHonorRollItem = (interviewer: InterviewerModel, item): HonorRollDTO => {
  const result = {
    interviewer_employee_id: interviewer.employee_id,
    interviewer_name: interviewer.name,
    interviewer_profile: interviewer.getPicUrl(),
    interviewer_role: interviewer.role,
    avg_duration: getHours(item.avg_duration),
    count: item.count,
  }
  return result  as HonorRollDTO
}
