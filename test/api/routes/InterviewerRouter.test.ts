import * as chai from 'chai'
import * as chaiHttp from 'chai-http'
import { Interviewer } from '../../../src/models/Interviewer'
import RoleType from '../../../src/models/RoleType'
import { resetDB } from '../../db-test-setup'

import app from '../../../src/App'

chai.use(chaiHttp)
const expect = chai.expect

describe('interviewer Route', () => {
  describe('when no interviewer data in db', async () => {
    const interviewer = {
      name: 'interviewer1',
      employeeId: '123',
      jobRole: RoleType.QA,
    }

    await resetDB()

    it('should get empty interviewer ', async () => {
      const getAllAssignmentsRequest = await chai.request(app).get('/api/interviewers')
      expect(getAllAssignmentsRequest.res.body.length).to.eql(0)
    })

    it('should get all assignment with data after create', async () => {
      const createInterviewerRequest = await chai.request(app).post('/api/interviewers').send(interviewer)
      // const getAllAssignmentsRequest = await chai.request(app).get('/api/interviewers')

      expect(createInterviewerRequest.res.body).to.eql({ message: 'create Successful' })
      // expect(getAllAssignmentsRequest.res.body.length).to.eql(1)
    })
  })
})
