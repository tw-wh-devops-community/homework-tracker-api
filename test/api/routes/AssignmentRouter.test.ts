import * as chai from 'chai'
import chaiHttp = require('chai-http')
import { Interviewer } from '../../../src/models/Interviewer'
import RoleType from '../../../src/models/RoleType'
import { resetDB } from '../../db-test-setup'

import app from '../../../src/App'

chai.use(chaiHttp)
const expect = chai.expect

describe('assignment api',()=>{
  describe('when no assignment data in db', async () => {
    const payload = {
      interviewerIds: [123, 321],
      candidateName: 'candidateName',
      jobRole: 'DEV',
      assignedDate: '2011-01-01',
      deadlineDate: '2011-02-12',
    }

    beforeEach(async () => {
      const interviewer1 = new Interviewer({name: 'interviewer1', employee_id: '123', role: RoleType.QA})
      const interviewer2 = new Interviewer({name: 'interviewer2', employee_id: '321', role: RoleType.DEV})
      await interviewer2.save()
      await interviewer1.save()
    });

    afterEach(async () => {
      await resetDB();
    });

    it('should get empty assignment ', async () => {
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')

      expect(getAllAssignmentsRequest.res.body.length).to.eql(0)
    })

    it('should get all assignment with data after create', async () => {
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')

      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      expect(getAllAssignmentsRequest.res.body.length).to.eql(2)
    })
  })

  describe('when assignments data in db', async () => {
    const payload = {
      interviewerIds: [321],
      candidateName: 'candidateName',
      jobRole: 'DEV',
      assignedDate: '2011-01-01',
      deadlineDate: '2011-02-12',
    }

    let assignmentId
    beforeEach(async () => {
      const interviewer1 = new Interviewer({name: 'interviewer1', employee_id: '123', role: RoleType.QA})
      const interviewer2 = new Interviewer({name: 'interviewer2', employee_id: '321', role: RoleType.DEV})
      await interviewer2.save()
      await interviewer1.save()
      await chai.request(app).post('/api/assignments').send(payload)

      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      assignmentId = getAllAssignmentsRequest.res.body[0].id
    });

    afterEach(async () => {
      await resetDB();
    });


    it('should get all assignment with data after create', async () => {
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')

      expect(getAllAssignmentsRequest.res.body.length).to.eql(1)
    })

    it('should get assignment by id', async () => {
      const getAssignmentsByIdRequest = await chai.request(app).get(`/api/assignments/${assignmentId}`)
      const { res } = getAssignmentsByIdRequest

      expect(res.body.candidate).to.eql('candidateName')
      expect(res.body.job_role).to.eql('DEV')
      expect(res.body.interviewer_name).to.eql('interviewer2')
      expect(res.body.interviewer_employee_id).to.eql('321')
      expect(res.body.is_finished).to.eql(false)
      expect(res.body.status).to.eql('overdue')
    })

    it('should delete assignment by id', async () => {
      const deleteAssignmentRequest = await chai.request(app).delete(`/api/assignments/${assignmentId}`)
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')

      expect(deleteAssignmentRequest.res.body).to.eql({message: 'deleted'})
      expect(getAllAssignmentsRequest.res.body.length).to.eql(0)
    })

    it('should update assignment finish status', async() =>{
      const updatePayload = {
        id: assignmentId,
        finished_date: '2017-02-10',
        is_finished: true
      }
      await chai.request(app).put('/api/assignments').send(updatePayload)
      const getAssignmentsByIdRequest = await chai.request(app).get(`/api/assignments/${assignmentId}`)
      const { res } = getAssignmentsByIdRequest

      expect(res.body.is_finished).to.eql(true)
      expect(res.body.status).to.eql('finished')
    })

    it('should create one assignment when provide enough data with one interviewer', async () => {
      const payload1 = {
        interviewerIds: [123],
        candidateName: 'candidateNameSecond',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentsRequest = await chai.request(app).post('/api/assignments').send(payload1)
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')

      expect(createAssignmentsRequest.res.body).to.eql({message: 'create Successful'})
      expect(getAllAssignmentsRequest.res.body.length).to.eql(2)
    })

    it('should create two assignment when provide enough data with two interviewer', async() => {
      const payload1 = {
        interviewerIds: [123, 321],
        candidateName: 'candidateNameSecond',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentsRequest = await chai.request(app).post('/api/assignments').send(payload1)
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')

      expect(createAssignmentsRequest.res.body).to.eql({message: 'create Successful'})
      expect(getAllAssignmentsRequest.res.body.length).to.eql(3)
    })
  })
})

