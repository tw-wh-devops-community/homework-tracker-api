import * as chai from 'chai'
import { AssignmentOperateLog, AssignmentOperateLogModel } from '../../../src/models/AssignmentOperateLog'
import { AssignmentOperateAction } from '../../../src/models/AssignmentOperateAction'
import { Homework } from '../../../src/models/Homework'
import { Interviewer } from '../../../src/models/Interviewer'
import { Assignment } from '../../../src/models/Assignment'
import RoleType from '../../../src/models/RoleType'
import { resetDB } from '../../db-test-setup'

const expect = chai.expect
describe('AssignmentOperateLog model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('save add assignmentOperateLog', async () => {
    const interviewer = new Interviewer({name: 'foo1', employee_id: '123', role:RoleType.QA})
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

    const date = new Date()
    const assignmentId = savedAssignment
    const operateContext = '新增作业记录'
    const assignmentOperateLog = new AssignmentOperateLog({
      assignment_id : assignmentId,
      operate_action : AssignmentOperateAction.ADD,
      operate_context : operateContext,
      operate_time : date
    })
    const savedAssignmentOperateLog = await assignmentOperateLog.save();
    const latestAssignmentOperateLog = await AssignmentOperateLog.findById(savedAssignmentOperateLog.id)
    expect(latestAssignmentOperateLog.assignment_id.toString()).to.eql(assignmentId.id)
    expect(latestAssignmentOperateLog.operate_action).to.eql(AssignmentOperateAction.ADD)
    expect(latestAssignmentOperateLog.operate_context).to.eql(operateContext)
    expect(latestAssignmentOperateLog.operate_time).to.eql(date)
  })
})