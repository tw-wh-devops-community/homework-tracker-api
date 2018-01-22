import * as chai from 'chai'
import { CandidateHomework } from '../../../src/models/CandidateHomework'
import { Interviewer } from '../../../src/models/Interviewer'
import { HomeworkAssignment } from '../../../src/models/HomeworkAssignment'
import { resetDB } from '../../db.spec'

const expect = chai.expect
describe('CandidateHomework model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('should get the saved assignment info', async () => {
    const interviewer = new Interviewer({name: 'foo1', profile_pic: 'bar'})
    const savedInterviewer = await interviewer.save()
    const candidateHomework = new CandidateHomework({name: 'foo2', job_role: 'QA'})
    const savedCandidateHomework = await candidateHomework.save()
    const homeworkAssignment = new HomeworkAssignment({
      assigned_date: new Date(),
      deadline_date: new Date(),
      finished_date: null,
      is_finished: false
    })
    homeworkAssignment.interviewer_id = savedInterviewer
    homeworkAssignment.homework_id = savedCandidateHomework
    const savedAssignment = await homeworkAssignment.save()

    const latestHomeworkAssignment = await HomeworkAssignment.findById(savedAssignment.id)
    let queryInterviewer = await Interviewer.findOne({_id:latestHomeworkAssignment.interviewer_id}).exec()
    let queryCandidateHomework =await CandidateHomework.findOne({_id:latestHomeworkAssignment.homework_id}).exec()

    expect(latestHomeworkAssignment.is_finished).to.eql(false)
    expect(queryInterviewer.name).to.eql('foo1')
    expect(queryCandidateHomework.name).to.eql('foo2')
  })
})
