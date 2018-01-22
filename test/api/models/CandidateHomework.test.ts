import * as chai from 'chai'
import { CandidateHomework } from '../../../src/models/CandidateHomework'
import { resetDB } from '../../db.spec'

const expect = chai.expect
describe('CandidateHomework model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('should get the saved candidate homework info', async () => {
    const candidateHomework = new CandidateHomework({name: 'foo', job_role: 'QA'})
    const savedCandidateHomework = await candidateHomework.save()
    const latestCandidateHomework = await CandidateHomework.findById(savedCandidateHomework.id)
    expect(latestCandidateHomework.name).to.eql('foo')
  })
})
