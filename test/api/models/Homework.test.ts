import * as chai from 'chai'
import Homework from '../../../src/models/Homework'
import { resetDB } from '../../db-test-setup'

const expect = chai.expect
describe('Homework model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('should get the saved candidate homework info', async () => {
    const homework = new Homework({name: 'foo', job_role: 'QA'})
    const savedHomework = await homework.save()
    const latestHomework = await Homework.findById(savedHomework.id)
    expect(latestHomework.name).to.eql('foo')
  })
})
