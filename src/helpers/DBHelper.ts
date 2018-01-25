import * as mongoose from 'mongoose'
import * as bluebird from 'bluebird'
import * as dotenv from 'dotenv'

const plugCustomPromise = () => {
  mongoose.Promise = bluebird
}

const setDatabase = () => {
  dotenv.config()
  const env = process.env
  const nodeEnv = env.NODE_ENV
  const databaseURl = env[`DB_HOMEWORK_TRACKER_${nodeEnv.toUpperCase()}`]
  return `mongodb://${databaseURl}/homework-tracker-${nodeEnv}`
}

const connectDB = (successHandler?) => {
  plugCustomPromise()
  const db = setDatabase()
  mongoose.connect(db, { useMongoClient: true }).then(() => {
    if (successHandler) {
      successHandler()
    }
  })
}

export default connectDB
