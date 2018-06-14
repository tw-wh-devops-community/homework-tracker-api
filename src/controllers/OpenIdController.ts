import * as request from 'request'
import * as wechart from '../constants/WeChartsInfo'
import {OpenId, OpenIdModel} from '../models/OpenId'
import {Homework} from '../models/Homework'
import {Assignment, AssignmentModel} from '../models/Assignment'
import {Interviewer, InterviewerModel} from '../models/Interviewer'

// 发送交易得到用户的openId
export const getOpenId = async (req, res) => {
  const jsCode = req.query.jsCode
  console.log('req:' + req.query)
  const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?\
appid=${wechart.appid}&secret=${wechart.secret}&js_code=${jsCode}&grant_type=authorization_code`

  await request(requestUrl, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('body：' + body) // Show the HTML for the baidu homepage.
      // const openIdBindInfo = queryOpenIdBind(body.openid)
      const bodyJson = JSON.parse(body)
      const openIdModel: OpenIdModel = await OpenId.findOne({'open_id': bodyJson.openid}).exec()

      if (openIdModel == null) {
        res.status(200).json({openId: bodyJson.openid})
        return
      } else {
        const interviewer: InterviewerModel = await Interviewer.findOne({'_id': openIdModel.interviewer_id}).exec()
        const result = {
            'openId': openIdModel.open_id,
            'interviewerId': openIdModel.interviewer_id,
            'interviewerName': interviewer.name,
        }
        res.status(200).json(result)
      }
    }
  })
}

const getAssignmentItemForSinglerInterviewer = async (assignment) => {
  const homework = await Homework.findOne( {_id: assignment.homework_id})
  const fullAssignmentInfo = {
        'candidate_name': homework.name,
        'assign_date': assignment.assign_date,
        'deadline_date': assignment.deadline_date,
    }
  return fullAssignmentInfo
}

const getUnfinishedHomeWorks = async (interviewerId) => {

  const unfinished: AssignmentModel[] = await Assignment
      .find({'interviewer_id': interviewerId, 'is_finished': false})

  const result = Promise.all(unfinished.map(getAssignmentItemForSinglerInterviewer))
  return result
}

const getTotalFinishedHomeWorksInCurrentYear = async (interviewerId) => {

  const currentYear = new Date().getFullYear()
  console.log('year:' + currentYear)
  const finishedHomeWorks = await Assignment
    .find({'interviewer_id': interviewerId, 'is_finished': true, 'assigned_date': {$gte: new Date(currentYear, 1, 1)}})
      // .find({'interviewer_id': interviewerId, 'is_finished': true})
    .exec()
  console.log(finishedHomeWorks)
  return finishedHomeWorks.length
}

export const getHomeworkInfoForWeChat = async (req, res) => {

  const interviewerId = req.params.interviewerId
  const numberOfFinshed = await getTotalFinishedHomeWorksInCurrentYear(interviewerId)
  const unFinished = await getUnfinishedHomeWorks(interviewerId)

  const result = {
        'numberOfFinished': numberOfFinshed,
        'unfinished': unFinished,
    }

  res.status(200).json(result)
}

export const addBind = async (req, res) => {

    const openId = req.body.openId
    const interviewerId = req.body.interviewerId

    const openIdModel = new OpenId(
        {
            open_id: openId,
            interviewer_id: interviewerId,
        })
    await openIdModel.save()
    res.status(201).json({message: 'insert successfully'})
}

export const removeBind = async (req, res) => {

    const openId = req.body.openId
    const interviewerId = req.body.interviewerId

    await OpenId.remove(
        {'interviewer_id': interviewerId, 'open_id': openId}, (err) => {
        if (err == null) {
            res.status(200).json({message: 'unbind successfully!'})
            return
        } else {
            res.status(400).json({message: 'failed to unbind!'})
        }
    })
}
