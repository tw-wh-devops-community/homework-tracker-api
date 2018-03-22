import { Assignment } from '../models/Assignment'
import { Interviewer } from '../models/Interviewer'
import * as moment from 'moment'
import { mapBulletin } from '../dto-mapper/BulletinMapper'

const getBulletinItem = async (item) => {
  const interviewer = await Interviewer.findOne({_id: item._id.interviewer_id})
  return mapBulletin(interviewer, item)
}

export const getBulletins = async (req, res) => {
  const today = moment()
  const tomorrow = moment().add(1, 'day')

  const matchRules = {
    intraday: {
      $and: [
        {is_finished: false},
        {deadline_date: {$lte: tomorrow.toDate()}},
        {deadline_date: {$gt: today.toDate()}},
      ],
    },
    overdue: {
      $and: [
        {is_finished: false},
        {deadline_date: {$lte: today.toDate()}},
      ],
    },
    ongoing: {
      $and: [
        {is_finished: false},
        {deadline_date: {$gt: today.toDate()}},
      ],
    },
  }

  const resultsSortByInterviewer = await Assignment
    .aggregate([
      {
        $match: matchRules[req.query.type],
      },
      {
        $group:
          {
            '_id': {
              interviewer_id: '$interviewer_id',
            },
            'deadline_dates': {
              $push: '$deadline_date',
            },
            'time_priority': {
              $min: '$deadline_date',
            },
          },
      },
      {
        $sort: { time_priority: 1 },
      },
    ])
    .exec()

  const resultList = await Promise.all(resultsSortByInterviewer.map(getBulletinItem))
  res.json(resultList)
}
