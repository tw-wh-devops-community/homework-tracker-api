import * as mongoose from 'mongoose'
import * as bluebird from 'bluebird'
import * as dotenv from 'dotenv'

class DBHelper {
  constructor() {
    this.plugCustomPromise()
    this.setDatabase()
  }

  public connect(successHandler?) {
    mongoose.connect(this.db, { useMongoClient: true }).then(() => {
      if (successHandler) {
        successHandler()
      }
    })
  }

  private plugCustomPromise() {
    mongoose.Promise = bluebird
  }

  private setDatabase() {
    dotenv.config()
    const env = process.env
    const nodeEnv = env.NODE_ENV
    const databaseURl = env[`DB_HOMEWORK_TRACKER_${nodeEnv.toUpperCase()}`]
    this.db = `mongodb://${databaseURl}/homework-tracker-${nodeEnv}`
  }
}

export default new DBHelper()
