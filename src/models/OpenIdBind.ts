import * as mongoose from 'mongoose'

export type OpenIdBindModel = mongoose.Document & {
  employee_id: string,
  name: string,
  open_id: string,
  is_bind: boolean,
  update_time: Date,
}

const openIdBindSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interviewer',
  },
  name: {
    type: String,
  },
  open_id: {
    type: String,
  },
  is_bind: {
    type: Boolean,
  },
  update_time: {
    type: Date,
  },
})

export const OpenIdBind = mongoose.model<OpenIdBindModel>('OpenIdBind', openIdBindSchema)
