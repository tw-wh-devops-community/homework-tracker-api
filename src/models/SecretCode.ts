import * as mongoose from 'mongoose'

export type SecretCodeModel = mongoose.Document & {
    name: string,
    code: string,
    update_time: Date,
}

const secretSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Kindly set the name of the secretCode',
    },
    code: {
        type: String,
    },
    update_time: {
        type: Date,
    },
})

export const SecretCode = mongoose.model<SecretCodeModel>('SecretCode', secretSchema)
