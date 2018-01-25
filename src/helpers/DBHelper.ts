import * as mongoose from 'mongoose'
import * as bluebird from 'bluebird'

const plugCustomPromise = () => {
  mongoose.Promise = bluebird
}

const connectDB = (successHandler?) => {
  plugCustomPromise()
  const db = `mongodb://localhost/homework-tracker-${process.env.NODE_ENV}`
  mongoose.connect(db, { useMongoClient: true }).then(() => {
    if (successHandler) {
      successHandler()
    }
  })
}

export default connectDB
