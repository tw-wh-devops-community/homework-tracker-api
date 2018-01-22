import * as mockgooses from 'mockgoose'
import * as mongoose from 'mongoose'

mongoose.Promise = global.Promise
const mockGoose = mockgooses.Mockgoose
const mockGooseInstance = new mockGoose(mongoose)

before(async () => {
  await mockGooseInstance.prepareStorage()
  await mongoose.connect('mongodb://example.com/TestingDB', { useMongoClient: true })
})

after(async () => {
  await resetDB()
  await closeConnection()
})

const closeConnection = async() => {
  await mongoose.disconnect()
}

export const resetDB = async () => {
  await mockGooseInstance.mongooseObj.connection.dropDatabase()
}

