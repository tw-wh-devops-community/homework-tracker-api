import * as mongoose from 'mongoose'
import RoleType from '../models/RoleType'

const storePicBathUrl = 'fakeStorePicBathUrl'

export type InterviewerModel = mongoose.Document & {
  name: string,
  role: RoleType,
  employee_id: string,
  getPicUrl(): string,
}

const interviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly set the name of the interviewer',
  },
  role: {
    type: String,
    required: 'Kindly set the role of the interviewer',
  },
  employee_id: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
})

interviewerSchema.methods.getPicUrl = function(): string {
  return `${storePicBathUrl}${this.employee_id}`
}

export const Interviewer = mongoose.model<InterviewerModel>('Interviewer', interviewerSchema)
