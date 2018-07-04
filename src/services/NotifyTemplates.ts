import { dateFormat, isInTime, duration, fromNow, translateToCNDate } from '../utlis/dateFormat'

const NEW_HOMEWORK_TEMPLATE: string = `新作业提醒
亲爱的面试官{{interviewer}}，收到一条新作业待批改，具体信息如下：
候选人姓名：{{candidateName}}
候选人role：{{jobRole}}
作业分配时间：{{assignedDate}}
作业截止时间：{{deadlineDate}}`

const COMPLETE_HOMEWORK_TEMPLATE: string = `作业完成啦
亲爱的面试官{{interviewer}}，感谢您的参与，作业已完成~
候选人姓名：{{candidateName}}
作业完成时间：{{completeDate}}
作业完成时长：{{timeDuration}}
作业完成情况：{{completeCondition}}`

const UPDATE_INTERVIEWER_TEMPLATE: string = `作业面试官修改
亲爱的面试官{{interviewer}}，您的待批改作业已改派给其他面试官，请留意变更！
候选人姓名：{{candidateName}}
改派面试官：{{interviewer2}}`

const UDPATE_DEADLINE_TEMPLATE: string = `作业截止时间变更
亲爱的面试官{{interviewer}}，作业截止时间已修改，请留意变更!
候选人姓名：{{candidateName}}
现作业截止时间：{{deadlineDate}}
距离作业截止时长：剩余{{leftTime}}`

const DELETE_HOMEWORK_TEMPLATE: string = `作业删除通知
亲爱的面试官{{interviewer}}，您的作业已被删除，请留意变更！
候选人姓名：{{candidateName}}
备注：作业已删除，请至小程序查看详情`

const HOMEWORK_LEFT_TIME_NOTIFY: string = `
作业待完成提醒
亲爱的面试官{{interviewer}}，还有作业待完成，请抽时间尽快看作业哦~
作业数量：{{leftNum}}份作业待完成
{{leftTimeDes}}`

interface TData {
  interviewer: string
  candidateName: string
  jobRole?: string
  assignedDate?: string
  deadlineDate?: string
  completeDate?: string
  interviewer2?: string
  hour?: string
  minute?: string
}

const getNewHomeworkTemplate = (args: TData): string => {
    return NEW_HOMEWORK_TEMPLATE
      .replace(/\{\{interviewer\}\}/g, args.interviewer)
      .replace(/\{\{candidateName\}\}/g, args.candidateName)
      .replace(/\{\{jobRole\}\}/g, args!.jobRole)
      .replace(/\{\{assignedDate\}\}/g, args!.assignedDate)
      .replace(/\{\{deadlineDate\}\}/g, args!.deadlineDate)
}

const getCompleteHomeworkTemplate = (args: TData): string => {
  const completeInTimeStr = '按时完成作业任务，棒棒哒~'
  const completeOutTimeStr = '超时完成作业任务，继续加油哦~'
  const isIn = isInTime(args!.completeDate, args!.deadlineDate) <= 0
  let timeDuration: string | number = translateToCNDate(duration(args!.completeDate, args!.assignedDate))
  return COMPLETE_HOMEWORK_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
    .replace(/\{\{completeDate\}\}/g, dateFormat(args!.completeDate))
    .replace(/\{\{timeDuration\}\}/g, timeDuration)
    .replace(/\{\{completeCondition\}\}/g, isIn ? completeInTimeStr : completeOutTimeStr)
}

const getUpdateInterviewerTemplate = (args: TData): string => {
  return UPDATE_INTERVIEWER_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
    .replace(/\{\{interviewer2\}\}/g, args!.interviewer2)
}

const getUpdateDeadlineTemplate = (args: TData): string => {
  const leftTime = translateToCNDate(fromNow(args!.deadlineDate))
  return UDPATE_DEADLINE_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
    .replace(/\{\{deadlineDate\}\}/g, dateFormat(args!.deadlineDate))
    .replace(/\{\{leftTime\}\}/g, leftTime)
}

const getDeleteHomeworkTemplate = (args: TData): string => {
  return DELETE_HOMEWORK_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
}

const getHomeworkLeftTimeTemplate = (args): string => {
    const {interviewer, leftNum, leftTime} = args
    const leftDes = leftTime < 0
        ? `已超期时间：已超期${translateToCNDate(-leftTime)}`
        : `截止时间：仅剩${translateToCNDate(leftTime)}"`

    return HOMEWORK_LEFT_TIME_NOTIFY
        .replace(/\{\{interviewer\}\}/g, interviewer)
        .replace(/\{\{leftNum\}\}/g, leftNum)
        .replace(/\{\{leftTimeDes\}\}/g, leftDes)
}

export default {
  getNewHomeworkTemplate,
  getCompleteHomeworkTemplate,
  getUpdateDeadlineTemplate,
  getUpdateInterviewerTemplate,
  getDeleteHomeworkTemplate,
  getHomeworkLeftTimeTemplate,
}
