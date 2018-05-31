import { AssignmentOperateLogModel } from '../models/AssignmentOperateLog'
import { AssignmentOperateLogDTO } from '../dto/AssignmentOperateLog'
import getDTOFromModel from '../helpers/DTOMapperHelper'

export const mapInterviewer = (AssignmentOperateLog) =>
    getDTOFromModel(AssignmentOperateLog,
        ['assignment_id', 'operate_action', 'operate_context', 'operate_time'])

export const mapInterviewers = (assignmentOperateLogs): AssignmentOperateLogDTO[] => (
    assignmentOperateLogs.map((assignmentOperateLog: AssignmentOperateLogModel) => mapInterviewer(assignmentOperateLog))
)
