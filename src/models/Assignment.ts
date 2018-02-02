import * as mongoose from 'mongoose'
import ReviewStatus from './ReviewStatus'

export type AssignmentModel = mongoose.Document & {
  homework_id: any,
  interviewer_id: any,
  assigned_date: Date,
  deadline_date: Date,
  finished_date: Date,
  is_finished: boolean,
  getStatus(): ReviewStatus,
}

const assignmentSchema = new mongoose.Schema({
  homework_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CandidateHomework',
  },
  interviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interviewer',
  },
  assigned_date: {
    type: Date,
  },
  deadline_date: {
    type: Date,
  },
  is_finished: {
    type: Boolean,
  },
  finished_date: {
    type: Date,
  },
})

assignmentSchema.methods.getStatus = function(): string {
  if (this.is_finished) {
    return ReviewStatus.finished
  }
  return new Date() < new Date(this.deadline_date) ? ReviewStatus.ongoing : ReviewStatus.overdue
}

export const Assignment =
  mongoose.model<AssignmentModel>('Assignment', assignmentSchema)
