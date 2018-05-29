import * as mongoose from 'mongoose'
import { AssignmentOperateAction } from './AssignmentOperateAction'

export type AssignmentOperateLogModel = mongoose.Document & {
  assignment_id: any,
  operate_action: AssignmentOperateAction,
  operate_context: string,
  operate_time: Date,
}

const assignmentOperateLogSchema = new mongoose.Schema({
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
  },
  operate_action: {
    type: Number,
  },
  operate_context: {
    type: String,
  },
  operate_time: {
    type: Date,
  },
})

export const AssignmentOperateLog =
  mongoose.model<AssignmentOperateLogModel>('AssignmentOperateLog', assignmentOperateLogSchema)
