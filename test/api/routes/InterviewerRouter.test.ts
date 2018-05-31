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

    it('should get all interviewer with data after create', async () => {
      const createInterviewerRequest = await chai.request(app).post('/api/interviewers').send(interviewer)
      const getAllAssignmentsRequest = await chai.request(app).get('/api/interviewers')

      expect(createInterviewerRequest.res.body).to.eql({ message: 'create Successful' })
      expect(getAllAssignmentsRequest.res.body.length).to.eql(1)
    })

    it('should create interviewer repeat by employee id', async () => {
      const interviewerModel =
        new Interviewer({ name: interviewer.name, role: interviewer.jobRole, employee_id: interviewer.employeeId })
      await interviewerModel.save()

      chai.request(app)
        .post('/api/interviewers')
        .send(interviewer)
        .then(() => { }, res => {
          expect(res.status).to.eql(400)
          expect(res.body).to.eql({ message: '员工编号重复' })
        })
    })

    it('should create interviewer repeat by name and role', async () => {
      const interviewerModel =
        new Interviewer({ name: interviewer.name, role: interviewer.jobRole, employee_id: 100000 })
      await interviewerModel.save()

      chai.request(app)
        .post('/api/interviewers')
        .send(interviewer)
        .then(() => { }, res => {
          expect(res.status).to.eql(400)
          expect(res.body).to.eql({ message: '姓名与角色重复' })
        })
    })
  })
})
