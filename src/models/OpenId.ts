import * as mongoose from 'mongoose'

export type OpenIdModel = mongoose.Document & {
    open_id: string,
    interviewer_id: any,
    nick_name: string
}

const openIdSchema = new mongoose.Schema({
    open_id: {
        type: String,
        required: 'Kindly set the open_id of the interview',
    },
    interviewer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interviewer',
    },
    nick_name: {
        type: String
    }
})

export const OpenId = mongoose.model<OpenIdModel>('OpenId', openIdSchema)
