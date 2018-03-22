import * as mongoose from 'mongoose'
import * as bluebird from 'bluebird'
import envHelper from './EnvHelper'

export class DBHelper {
  private db: any

  constructor() {
    this.plugCustomPromise()
    this.setDatabase()
  }

  public connect() {
    return mongoose.connect(this.db, { useMongoClient: true })
  }

  public disconnect() {
    return mongoose.disconnect()
  }

  private plugCustomPromise() {
    (mongoose as any).Promise = bluebird
  }

  private setDatabase() {
    const nodeEnv = envHelper.getNodeEnv()
    const databaseURl = envHelper.getEnvProperty(`DB_HOMEWORK_TRACKER_${nodeEnv.toUpperCase()}`)
    this.db = `mongodb://${databaseURl}/homework-tracker-${nodeEnv}`
  }
}

export default new DBHelper()
