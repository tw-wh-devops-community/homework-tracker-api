import * as mongoose from 'mongoose'

export type homeworkModel = mongoose.Document & {
  name: string,
  job_role: string,
}

const homeworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly set the name of the candidate',
  },
  job_role: {
    type: String,
  },
})

export default mongoose.model<homeworkModel>('Homework', homeworkSchema)
