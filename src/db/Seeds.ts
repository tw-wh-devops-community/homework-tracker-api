import dbHelper from '../helpers/DBHelper'
import { interviewerModel, Interviewer } from '../models/Interviewer'

const interviewers: interviewerModel[] = require('../../data/interviewer.json') // tslint:disable-line

const initInterviewers = () => {
  let done = 0
  interviewers.forEach(async (interviewerData) => {
    const interviewer = new Interviewer(interviewerData)
    await interviewer.save()
    done++
    console.log(`Importing ${interviewer.name}...`) // tslint:disable-line
    if (done === interviewers.length) {
      dbHelper.disconnect().then(() => {
        console.log(`${interviewers.length} records are imported successfully, database disconnected.`) // tslint:disable-line
      })
    }
  })
}

dbHelper.connect().then(() => {
  initInterviewers()
})
