import { Assignment } from '../models/Assignment'
import { Interviewer } from '../models/Interviewer'
import { mapHonorRollItem } from '../dto-mapper/HonorRollMapper'
import * as moment from 'moment'

const getHonorRollItem = async (item) => {
  const interviewer = await Interviewer.findOne({_id: item._id.interviewer_id})
  return mapHonorRollItem(interviewer, item)
}

export const getHonorRolls = async (req, res) => {
  let { year, month } = req.query
  if (!year || !month) {
    const lastMonthDay = moment().subtract(1, 'month')
    year = lastMonthDay.year()
    month = lastMonthDay.month() + 1
  }
  const sortRules = {
    speed: { avg_duration: 1, count: -1 },
    quantity: { count: -1, avg_duration: 1 },
  }
  const startDay  = moment(`${year}-${month}-01`)
  const day = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()
  const endDay  = moment(`${year}-${month}-${day}`)

  const resultsSortByInterviewer = await Assignment
    .aggregate([
      {
        $match: {
          $and: [
            {is_finished: true },
            {finished_date: {$gt: startDay.toDate()}},
            {finished_date: {$lte: endDay.toDate()}},
          ],
        },
      },
      {
        $group:
          {
            '_id': {
              interviewer_id: '$interviewer_id',
            },
            'assigned_dates': {
              $push: '$assigned_date',
            },
            'finish_dates': {
              $push: '$finished_date',
            },
            'avg_duration': {
              $avg: { $subtract: ['$finished_date', '$assigned_date'] },
            },
            'count': { $sum: 1 },
          },
      },
      {
        $sort: sortRules[req.query.type],
      },
    ])
    .exec()
  const resultList = await Promise.all(resultsSortByInterviewer.map(getHonorRollItem))
  res.json(resultList)
}
