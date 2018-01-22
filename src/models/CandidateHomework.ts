import * as mongoose from 'mongoose'

export type candidateHomeworkModel = mongoose.Document & {
  name: string,
  job_role: string,
}

const candidateHomeworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly set the name of the candidate',
  },
  job_role: {
    type: String,
  },
})

export const CandidateHomework = mongoose.model<candidateHomeworkModel>('CandidateHomework', candidateHomeworkSchema)
