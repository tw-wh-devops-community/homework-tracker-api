import * as chai from 'chai'
import * as chaiHttp from 'chai-http'
import { Interviewer } from '../../../src/models/Interviewer'
import { AssignmentOperateLog,AssignmentOperateLogModel} from '../../../src/models/AssignmentOperateLog'
import { AssignmentOperateAction } from '../../../src/models/AssignmentOperateAction'
import RoleType from '../../../src/models/RoleType'
import { resetDB } from '../../db-test-setup'
import {DataFormatHelper} from '../../../src/helpers/DateFormatHelper'

import app from '../../../src/App'

chai.use(chaiHttp)
const expect = chai.expect

describe('assignment api',()=>{
  describe('test assignmentOperateLog save',async () => {
    beforeEach(async () => {
      const interviewer1 = new Interviewer({name: 'interviewer1', employee_id: '123', role: RoleType.QA})
      const interviewer2 = new Interviewer({name: 'interviewer2', employee_id: '321', role: RoleType.DEV})
      await interviewer2.save()
      await interviewer1.save()
    });
    afterEach(async () => {
      await resetDB();
    });

    it('save one assignment should be insert one assignment operatelog',async () => {
      const payload = {
        interviewerIds: [123],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(1)
      const assignment = allAssignments[0]
      const getAllLogsRequest =  await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
      const allLogs = getAllLogsRequest.res.body
      expect(allLogs.length).to.eql(1)
      const log = allLogs[0]
      expect(log).to.eql({
        id:log.id,
        assignment_id:assignment.id,
        operate_action:2,
        operate_context:'新增作业记录',
        operate_time:log.operate_time
      })
    })

    it('save multi assignments should be save the same number assignment operatelogs',async () => {
      const payload = {
        interviewerIds: [123,321],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(2)
      for(let assignment of allAssignments){
        const getAllLogsRequest =  await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
        const allLogs = getAllLogsRequest.res.body
        expect(allLogs.length).to.eql(1)
        const log = allLogs[0]
        expect(log).to.eql({
          id:log.id,
          assignment_id:assignment.id,
          operate_action:2,
          operate_context:'新增作业记录',
          operate_time:log.operate_time
        })
      }
    })

    it('modified interviewer with an assignment should be save one assignment operatelog',async () => {
      const payload = {
        interviewerIds: [123],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(1)
      let assignment = allAssignments[0]
      const updatePayload = {
        id: assignment.id,
        interviewer_employee_id:321
      }
      await chai.request(app).put('/api/assignments').send(updatePayload)
      const getNewAssignmentRequest = await chai.request(app).get(`/api/assignments/${assignment.id}`)
      let newAssignment = getNewAssignmentRequest.res.body
      const getAllLogsRequest = await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
      let allLogs = getAllLogsRequest.res.body
      expect(allLogs.length).to.eql(2)
      expect(allLogs[0]).to.eql({
        id:allLogs[0].id,
        assignment_id:assignment.id,
        operate_action:1,
        operate_context:`修改面试官“${assignment.interviewer_name}”为“${newAssignment.interviewer_name}” `,
        operate_time:allLogs[0].operate_time
      })
    })

    it('modified allocation time with an assignment should be save one assignment operatelog',async () => {
      const payload = {
        interviewerIds: [123],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(1)
      let assignment = allAssignments[0]
      const updatePayload = {
        id: assignment.id,
        assigned_date:new Date()
      }
      await chai.request(app).put('/api/assignments').send(updatePayload)
      const getNewAssignmentRequest = await chai.request(app).get(`/api/assignments/${assignment.id}`)
      let newAssignment = getNewAssignmentRequest.res.body
      const getAllLogsRequest = await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
      let allLogs = getAllLogsRequest.res.body
      expect(allLogs.length).to.eql(2)
      
      expect(allLogs[0]).to.eql({
        id:allLogs[0].id,
        assignment_id:assignment.id,
        operate_action:1,
        operate_context:`修改分配时间“${new Date(assignment.assigned_date).toLocaleString()}”为“${new Date(newAssignment.assigned_date).toLocaleString()}” `,
        operate_time:allLogs[0].operate_time
      })
    })

    it('modified deadline with an assignment should be save one assignment operatelog',async () => {
      const payload = {
        interviewerIds: [123],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(1)
      let assignment = allAssignments[0]
      const updatePayload = {
        id: assignment.id,
        deadline_date:new Date()
      }
      await chai.request(app).put('/api/assignments').send(updatePayload)
      const getNewAssignmentRequest = await chai.request(app).get(`/api/assignments/${assignment.id}`)
      let newAssignment = getNewAssignmentRequest.res.body
      const getAllLogsRequest = await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
      let allLogs = getAllLogsRequest.res.body
      expect(allLogs.length).to.eql(2)
      expect(allLogs[0]).to.eql({
        id:allLogs[0].id,
        assignment_id:assignment.id,
        operate_action:1,
        operate_context:`修改截止时间“${new Date(assignment.deadline_date).toLocaleString()}”为“${new Date(newAssignment.deadline_date).toLocaleString()}” `,
        operate_time:allLogs[0].operate_time
      })
    })

    it('modified interviewer,allocation time,deadline should be save one log',async() => {
      const payload = {
        interviewerIds: [123],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(1)
      let assignment = allAssignments[0]
      const updatePayload = {
        id: assignment.id,
        deadline_date:new Date(),
        assigned_date:new Date(),
        interviewer_employee_id:321
      }
      await chai.request(app).put('/api/assignments').send(updatePayload)
      const getNewAssignmentRequest = await chai.request(app).get(`/api/assignments/${assignment.id}`)
      let newAssignment = getNewAssignmentRequest.res.body
      const getAllLogsRequest = await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
      let allLogs = getAllLogsRequest.res.body
      expect(allLogs.length).to.eql(2)
      expect(allLogs[0]).to.eql({
        id:allLogs[0].id,
        assignment_id:assignment.id,
        operate_action:1,
        operate_context:`修改分配时间“${new Date(assignment.assigned_date).toLocaleString()}”为“${new Date(newAssignment.assigned_date).toLocaleString()}” 修改截止时间“${new Date(assignment.deadline_date).toLocaleString()}”为“${new Date(newAssignment.deadline_date).toLocaleString()}” 修改面试官“${assignment.interviewer_name}”为“${newAssignment.interviewer_name}” `,
        operate_time:allLogs[0].operate_time
      })
    })

    it('modified status with an assignment should be save one assignment operatelog',async () => {
      const payload = {
        interviewerIds: [123],
        candidateName: 'candidateName',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      const createAssignmentRequest = await chai.request(app).post('/api/assignments').send(payload)
      expect(createAssignmentRequest.res.body).to.eql({message: 'create Successful'})
      const getAllAssignmentsRequest = await chai.request(app).get('/api/assignments')
      const allAssignments = getAllAssignmentsRequest.res.body
      expect(allAssignments.length).to.eql(1)
      let assignment = allAssignments[0]
      const updatePayload = {
        id: assignment.id,
        finished_date:new Date()
      }
      await chai.request(app).put('/api/assignments').send(updatePayload)
      const getNewAssignmentRequest = await chai.request(app).get(`/api/assignments/${assignment.id}`)
      let newAssignment = getNewAssignmentRequest.res.body
      const getAllLogsRequest = await chai.request(app).get(`/api/assignments/${assignment.id}/assignmentOperateLogs`)
      let allLogs = getAllLogsRequest.res.body
      expect(allLogs.length).to.eql(2)
      expect(allLogs[0]).to.eql({
        id:allLogs[0].id,
        assignment_id:assignment.id,
        operate_action:1,
        operate_context:`修改状态为“完成”`,
        operate_time:allLogs[0].operate_time
      })
    })
    // it('delete an assignment should be save one assignment operatelog',async () => {

    // })
  })


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
      expect(res.body.interviewer_profile).to.eql(null)
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

    it('should not create assignment when provide data with wrong interviewer employee id', async () => {
      const payload1 = {
        interviewerIds: [1234],
        candidateName: 'candidateNameSecond',
        jobRole: 'DEV',
        assignedDate: '2011-01-01',
        deadlineDate: '2011-02-12',
      }
      chai.request(app)
        .post('/api/assignments')
        .send(payload1)
        .then(() => {}, res => {
          expect(res.status).to.eql(400)
          expect(res.body).to.eql({message: 'bad request, please check the homework interviewers'})

          const getAllAssignmentsRequest = await
          chai.request(app).get('/api/assignments')
          expect(getAllAssignmentsRequest.res.body.length).to.eql(1)
        })
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

