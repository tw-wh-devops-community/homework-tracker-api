import * as chai from 'chai'
import { Interviewer } from '../../../src/models/Interviewer'
import { resetDB } from '../../db.spec'

const expect = chai.expect
describe('interviewer model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('should get the saved interviewer info', async () => {
    const interviewer = new Interviewer({name: 'foo', profile_pic: 'bar'})
    const savedInterviewer = await interviewer.save()
    const latestInterviewer = await Interviewer.findById(savedInterviewer.id)
    expect(latestInterviewer.name).to.eql('foo')
  })
})
