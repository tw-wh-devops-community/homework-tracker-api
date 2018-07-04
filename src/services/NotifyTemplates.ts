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
作业完成时长：{{completeDate}}-{{assignedDate}}
作业完成情况：{{completeCondition}}`

const UPDATE_INTERVIEWER_TEMPLATE: string = `作业面试官修改
亲爱的面试官{{interviewer}}，您的待批改作业已改派给其他面试官，请留意变更！
候选人姓名：{{candidateName}}
改派面试官：{{interviewer2}}`

const UDPATE_DEADLINE_TEMPLATE: string = `作业截止时间变更
亲爱的面试官{{interviewer}}，作业截止时间已修改，请留意变更!
候选人姓名：{{candidateName}}
现作业截止时间：{{deadlineDate}}
距离作业截止时长：剩余{{hour}}小时{{minute}}分钟`

const DELETE_HOMEWORK_TEMPLATE: string = `作业删除通知
亲爱的面试官{{interviewer}}，您的作业已被删除，请留意变更！
候选人姓名：{{candidateName}}
备注：作业已删除，请至小程序查看详情`

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

  // todo 
  // 需要判断当前时间和截止时间，看是否超时
  return NEW_HOMEWORK_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
    .replace(/\{\{completeDate\}\}/g, args!.completeDate)
    .replace(/\{\{assignedDate\}\}/g, args!.assignedDate)
    .replace(/\{\{completeCondition\}\}/g, '')
}

const getUpdateInterviewerTemplate = (args: TData): string => {
  return NEW_HOMEWORK_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
    .replace(/\{\{interviewer2\}\}/g, args!.interviewer2)
}

const getUpdateDeadlineTemplate = (args: TData): string => {
  return NEW_HOMEWORK_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
    .replace(/\{\{deadlineDate\}\}/g, args!.deadlineDate)
    .replace(/\{\{hour\}\}/g, '1')
    .replace(/\{\{minute\}\}/g, '2')
}

const getDeleteHomeworkTemplate = (args: TData): string => {
  return NEW_HOMEWORK_TEMPLATE
    .replace(/\{\{interviewer\}\}/g, args.interviewer)
    .replace(/\{\{candidateName\}\}/g, args.candidateName)
}

export default {
  getNewHomeworkTemplate,
  getCompleteHomeworkTemplate,
  getUpdateDeadlineTemplate,
  getUpdateInterviewerTemplate,
  getDeleteHomeworkTemplate
}