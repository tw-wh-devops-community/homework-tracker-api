import dbHelper from '../helpers/DBHelper'
import { interviewerModel, Interviewer } from '../models/Interviewer'

const interviewers: interviewerModel[] = require('../../data/interviewer.json') // tslint:disable-line

const initInterviewers = () => {
  interviewers.forEach(async (interviewerData) => {
    const interviewer = new Interviewer(interviewerData)
    await interviewer.save()
  })
  console.log(`Importing interviewers done.`) // tslint:disable-line
}

const disconnectDB = () => {
  dbHelper.disconnect().then(() => {
    console.log('database disconnected.') // tslint:disable-line
  })
}

dbHelper.connect().then(() => {
  initInterviewers()
}).then(() => {
  disconnectDB()
}).catch((error) => {
  console.log('Error when importing data', error)
  disconnectDB()
})
