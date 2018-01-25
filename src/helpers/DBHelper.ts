import * as mongoose from 'mongoose'

mongoose.Promise = require('bluebird')

const connectDB = (successHandler?) => {
  const db = `mongodb://localhost/homework-tracker-${process.env.NODE_ENV}`
  mongoose.connect(db, { useMongoClient: true }).then(() => {
    if (successHandler) {
      successHandler()
    }
  })
}

export default connectDB


