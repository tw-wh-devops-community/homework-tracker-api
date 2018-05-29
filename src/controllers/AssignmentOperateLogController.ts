import { Interviewer, InterviewerModel } from '../models/Interviewer'
import { AssignmentOperateLogDTO } from '../dto/AssignmentOperateLog'
import { mapInterviewers } from '../dto-mapper/AssignmentOperateLogMapper'
import { AssignmentOperateLog, AssignmentOperateLogModel } from '../models/AssignmentOperateLog';

export const getAssignmentOperateLogs = async (req, res) => {
  try {
    const assignmentOperateLogs: AssignmentOperateLogModel[] = await AssignmentOperateLog
      .find({assignment_id:req.params.id})
      .sort({operate_time: -1}).exec()
    const assignmentOperateLogJson: AssignmentOperateLogDTO[] = mapInterviewers(assignmentOperateLogs)
    res.json(assignmentOperateLogJson)
  } catch (error) {
    res.status(400).json({ error })
  }
}
