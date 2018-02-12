import * as moment from 'moment'
import * as _ from 'lodash'
import { BulletinDTO } from '../dto/BulletinDTO'
import { InterviewerModel } from '../models/Interviewer'

export const mapBulletin = (interviewer: InterviewerModel, item): BulletinDTO => {
  const result = {
    interviewer_employee_id: interviewer.employee_id,
    interviewer_name: interviewer.name,
    interviewer_profile: interviewer.getPicUrl(),
    interviewer_role: interviewer.role,
    time_records: _.orderBy(item.deadline_dates.map((a) => Math.abs(moment(a).diff(moment(), 'hour')))),
  }
  return result  as BulletinDTO
}
