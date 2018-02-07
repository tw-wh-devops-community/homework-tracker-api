import * as moment from 'moment'
import { BulletinDTO } from '../dto/BulletinDTO'
import { InterviewerModel } from '../models/Interviewer'

export const mapBulletin = (interviewer: InterviewerModel, item): BulletinDTO => {
  const result = {
    interviewer_employee_id: interviewer.employee_id,
    interviewer_name: interviewer.name,
    interviewer_profile: interviewer.getPicUrl(),
    interviewer_role: interviewer.role,
    time_records: item.deadline_dates.map((a) => moment(a).diff(moment(), 'hour')),
  }
  return result  as BulletinDTO
}
