import { InterviewerModel, Interviewer } from '../models/Interviewer'
import { InterviewerDTO } from '../dto/Interviewer'
import { mapInterviewers } from '../dto-mapper/InterviewerMapper'
import * as pinyin from 'pinyin'
import {OpenId, OpenIdModel} from '../models/OpenId'

const getPinyin = (name) => pinyin(name).join()
export const getInterviewers = async (req, res) => {
  try {
    const interviewers: InterviewerModel[] = await Interviewer
      .find({})
      .sort({ pinyin_name: 1 }).exec()
    const interviewersJson: InterviewerDTO[] = mapInterviewers(interviewers)
    res.json(interviewersJson)
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const getInterviewersByName = async (req, res) => {
  try {
    const searchName = req.params.name
    const interviewers: InterviewerModel[] = await Interviewer
  .find({ name: new RegExp(searchName) })
      .sort({ pinyin_name: 1 }).exec()
    const interviewersJson: InterviewerDTO[] = mapInterviewers(interviewers)
    res.json(interviewersJson)
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const createInterviewers = async (req, res) => {
  const data = req.body

  const employee = await Interviewer.findOne({ 'employee_id': data.employeeId })

  if (employee != null) {
    res.status(400).json({ message: '员工编号重复' })
    return
  }

  const interviewerModel = await Interviewer.findOne({ 'name': data.name, 'role': data.jobRole })

  if (interviewerModel != null) {
    res.status(400).json({ message: '姓名与角色重复' })
    return
  }

  const interviewer = new Interviewer({ name: data.name, role: data.jobRole, employee_id: data.employeeId })
  await interviewer.save()
  res.status(201).json({ message: 'create Successful' })
}

export const updateInterviewers = async (req, res) => {
  const data = req.body
  const employee = await Interviewer.findOne( {'_id': data.id})
  const id = data.id

  if (employee == null) {
    res.status(400).json({message: 'not existed employee id'})
    return
  }

  const interviewerByEmployeeId = await Interviewer.findOne({'employee_id': data.employeeId, '_id': {$ne: id}})
  if (interviewerByEmployeeId != null) {
    res.status(400).json({message: 'chosen id is already existed!'})
    return
  }

  const employeeByNameAndRole = await Interviewer.
    findOne({'name': data.name, 'role': data.jobRole, '_id': {$ne: id}})
  if (employeeByNameAndRole != null) {
    res.status(400)
        .json({message: 'The combination of chosen name and role is already existed!'})
    return
  }

  const query = {'_id': data.id}
  const updateInterviewer = {
    'name': data.name,
    'employee_id': data.employeeId,
    'role': data.jobRole,
    'pinyin_name': getPinyin(data.name)}
  await Interviewer.findOneAndUpdate(query, updateInterviewer)

  res.status(200).json({message: 'update successful' })
 }

export const getUnbindInterviewers = async (res, req) => {

  const interviewerName = res.query.name
  const binds: OpenIdModel[] = await OpenId.find().exec()
  const bindInterviewerIds = binds.map((item) => {
        return item.interviewer_id
    })
  if (interviewerName == null) {

      const unBindedInterviewers: InterviewerModel[] =
          await Interviewer.find({'_id': {$nin: bindInterviewerIds}}).exec()

      req.status(200).json(unBindedInterviewers)
      return
  }

  const interviewers: InterviewerModel[] =
      await Interviewer.find({ '_id': {$nin: bindInterviewerIds}, 'name': new RegExp(interviewerName)})

  req.status(200).json(interviewers)
  return
}
