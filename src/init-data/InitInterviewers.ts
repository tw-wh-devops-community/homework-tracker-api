import * as mongoose from 'mongoose'
import { Interviewer } from '../models/Interviewer'
import * as interviewers from '../../data/interviewer.json'

const dbURI = `mongodb://localhost/homework-tracker-${process.env.NODE_ENV}`
mongoose.connect(dbURI, () => {
  let done = 0
  interviewers.forEach( async (v) => {
    const interviewer = new Interviewer(v)
    await interviewer.save()
    done++

    if (done === interviewers.length) {
      mongoose.disconnect(() => {
        console.log(done) // tslint:disable-line
        console.log('disconnected') // tslint:disable-line
      })
    }
  })
})
