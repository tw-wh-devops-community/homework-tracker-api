import * as mongoose from 'mongoose'

export type homeworkAssignmentModel = mongoose.Document & {
  homework_id: any,
  interviewer_id: any,
  assigned_date: Date,
  deadline_date: Date,
  finished_date: Date,
  is_finished: boolean
}


const homeworkAssignmentSchema = new mongoose.Schema({
  homework_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CandidateHomework'
  },
  interviewer_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interviewer'
  },
  assigned_date: {
    type: Date
  },
  deadline_date: {
    type: Date
  },
  is_finished:{
    type: Boolean
  },
  finished_date:{
    type: Date
  }
})


export const HomeworkAssignment = mongoose.model<homeworkAssignmentModel>('HomeworkAssignment', homeworkAssignmentSchema)
