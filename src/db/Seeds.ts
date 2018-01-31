import dbHelper from '../helpers/DBHelper'
import { InterviewerModel, Interviewer } from '../models/Interviewer'

const interviewers: InterviewerModel[] = require('../../data/interviewer.json') // tslint:disable-line

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

dbHelper.connect().then(async () => {
  await initInterviewers()
}).then(() => {
  disconnectDB()
}).catch((error) => {
  console.log('Error when importing data', error) // tslint:disable-line
  disconnectDB()
})
