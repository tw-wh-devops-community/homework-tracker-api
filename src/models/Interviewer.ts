import * as mongoose from 'mongoose'

export type interviewerModel = mongoose.Document & {
  name: string,
  profile_pic: any,
}

const interviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly set the name of the interviewer'
  },
  profile_pic: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  },
})


export const Interviewer = mongoose.model<interviewerModel>('Interviewer', interviewerSchema)
