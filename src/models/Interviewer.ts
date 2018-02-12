import * as mongoose from 'mongoose'
import * as pinyin from 'pinyin'
import RoleType from '../models/RoleType'
import * as fs from 'fs'
import { getUploadPath } from '../constants/UploadPath'

const storePicBathUrl = 'image/'

const getPinyin = (name) => {
  return pinyin(name).join()
}

export type InterviewerModel = mongoose.Document & {
  name: string,
  pinyin_name: string,
  role: RoleType,
  employee_id: string,
  getPicUrl(): string,
}

const interviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly set the name of the interviewer',
  },
  pinyin_name: {
    type: String,
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

interviewerSchema.pre('save', function(next) {
  this.pinyin_name = getPinyin(this.name)
  next()
})

interviewerSchema.methods.getPicUrl = function(): string {
  const imagePath = getUploadPath() + this.employee_id + '.png'
  if (fs.existsSync(imagePath)) {
    return `${storePicBathUrl}${this.employee_id}`
  } else {
    return null
  }

}

export const Interviewer = mongoose.model<InterviewerModel>('Interviewer', interviewerSchema)
