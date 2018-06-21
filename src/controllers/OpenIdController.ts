import * as request from 'request'
import * as wechart from '../constants/WeChartsInfo'
import {OpenId, OpenIdModel} from '../models/OpenId'
import {Homework} from '../models/Homework'
import {Assignment, AssignmentModel} from '../models/Assignment'
import {Interviewer, InterviewerModel} from '../models/Interviewer'
import {SecretCode, SecretCodeModel} from '../models/SecretCode'

// 发送交易得到用户的openId
export const getOpenId = async (req, res) => {
  const jsCode = req.query.jsCode
  console.log('req:' + req.query)
  const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?\
appid=${wechart.appid}&secret=${wechart.secret}&js_code=${jsCode}&grant_type=authorization_code`

  await request(requestUrl, async (error, response, body) => {
    if (!error && response.statusCode === 200) {

      const bodyJson = JSON.parse(body)
      const openIdModel: OpenIdModel =
          await OpenId.findOne({'open_id': bodyJson.openid}).populate('interviewer_id').exec()

      if (openIdModel == null) {
        res.status(200).json({openId: bodyJson.openid})
        return
      } else {
        console.log('interviewer_id:' + openIdModel.interviewer_id.name)
        const result = {
            'openId': openIdModel.open_id,
            'interviewerId': openIdModel.interviewer_id._id,
            'interviewerName': openIdModel.interviewer_id.name,
            '_id': openIdModel._id,
        }
        res.status(200).json(result)
      }
    }
  })
}

const getAssignmentItemForSingleInterviewer = async (assignment) => {
  const homework = await Homework.findOne( {_id: assignment.homework_id})
  const fullAssignmentInfo = {
        'candidate_name': homework.name,
        'assigned_date': assignment.assigned_date,
        'deadline_date': assignment.deadline_date,
    }
  return fullAssignmentInfo
}

const getUnfinishedHomeWorks = async (interviewerId) => {

  const unfinished: AssignmentModel[] = await Assignment
      .find({'interviewer_id': interviewerId, 'is_finished': false})

  const result = Promise.all(unfinished.map(getAssignmentItemForSingleInterviewer))
  return result
}

const getTotalFinishedHomeWorksInCurrentYear = async (interviewerId) => {

  const currentYear = new Date().getFullYear()
  const finishedHomeWorks = await Assignment
    .find({'interviewer_id': interviewerId, 'is_finished': true, 'assigned_date': {$gte: new Date(currentYear, 1, 1)}})
      // .find({'interviewer_id': interviewerId, 'is_finished': true})
    .exec()
  console.log(finishedHomeWorks)
  return finishedHomeWorks.length
}

export const getHomeworkInfoForWeChat = async (req, res) => {

  const interviewerId = req.params.interviewerId
  const numberOfFinished = await getTotalFinishedHomeWorksInCurrentYear(interviewerId)
  const unFinished = await getUnfinishedHomeWorks(interviewerId)

  const result = {
        'numberOfFinished': numberOfFinished,
        'unfinished': unFinished,
    }

  res.status(200).json(result)
}

export const addBind = async (req, res) => {

    const openId = req.body.openId
    const interviewerId = req.body.interviewerId
    const code = req.body.code.toUpperCase()

    const secretCode: SecretCodeModel = await SecretCode.findOne({'name': 'secret_code'}).exec()
    if (code !== secretCode.code) {
        res.status(400).json({message: 'Secret code is wrong!'})
        return
    }

    const interviewer: InterviewerModel = await Interviewer.findOne({'_id': interviewerId}).exec()
    if (interviewer == null) {
        res.status(400).json({'message': 'InterviewerId is not existing!'})
        return
    }

    const existOpenIdModel: OpenIdModel = await OpenId.findOne({'open_id': openId}).exec()
    if (existOpenIdModel !== null) {
        res.status(400).json({'message': 'OpenId is already existing!'})
        return
    }

    const openIdModel = new OpenId(
        {
            open_id: openId,
            interviewer_id: interviewerId,
        })
    const savedOpenIdModel = await openIdModel.save()
    const result = {
        '_id': savedOpenIdModel._id,
        'open_id': openId,
        'interviewer_id': interviewerId,
    }
    res.status(201).json(result)
}

export const removeBind = async (req, res) => {

    const id = req.params.id
    await OpenId.findOneAndRemove(
        {'_id': id}, (err, story) => {
        if (err != null) {
            res.status(500).send(err)
            return
        }

        if (story == null) {
            res.status(400).json({'message': 'There is no document for the chosen id!'})
            return
        }

        res.status(200).json({'message': 'Unbind successfully!'})
    })
}
