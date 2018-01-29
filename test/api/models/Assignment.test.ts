import * as chai from 'chai'
import Homework from '../../../src/models/Homework'
import { Interviewer } from '../../../src/models/Interviewer'
import { Assignment } from '../../../src/models/Assignment'
import { resetDB } from '../../db-test-setup'
import { roleType } from '../../../src/helpers/Constant'

const expect = chai.expect
describe('Assignment model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('should get the saved assignment info', async () => {
    const interviewer = new Interviewer({name: 'foo1', employee_id: '123', role:roleType.QA})
    const savedInterviewer = await interviewer.save()
    const homework = new Homework({name: 'foo2', job_role: 'QA'})
    const savedHomework = await homework.save()
    const assignment = new Assignment({
      assigned_date: new Date(),
      deadline_date: new Date(),
      finished_date: null,
      is_finished: false
    })
    assignment.interviewer_id = savedInterviewer
    assignment.homework_id = savedHomework
    const savedAssignment = await assignment.save()

    const latestAssignment = await Assignment.findById(savedAssignment.id)
    let queryInterviewer = await Interviewer.findOne({_id:latestAssignment.interviewer_id}).exec()
    let queryHomework =await Homework.findOne({_id:latestAssignment.homework_id}).exec()

    expect(latestAssignment.is_finished).to.eql(false)
    expect(queryInterviewer.name).to.eql('foo1')
    expect(queryHomework.name).to.eql('foo2')
  })
})
