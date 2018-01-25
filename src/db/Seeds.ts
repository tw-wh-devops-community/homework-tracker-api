import * as mongoose from 'mongoose'
import connectDB from '../helpers/DBHelper'
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
      mongoose.disconnect().then(() => {
        console.log(`${interviewers.length} records are imported successfully, database disconnected.`) // tslint:disable-line
      })
    }
  })
}

connectDB(initInterviewers)
