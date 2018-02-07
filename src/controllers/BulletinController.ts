import {Assignment} from '../models/Assignment'
import {Interviewer} from '../models/Interviewer'
import * as moment from 'moment'
import {mapBulletin} from '../dto-mapper/BulletinMapper'

const getBulletinItem = async (item) => {
  const interviewer = await Interviewer.findOne({_id: item._id.interviewer_id})
  return mapBulletin(interviewer, item)
}

export const getBulletins = async (req, res) => {
  const today = moment()
  const tomorrow = moment().add(1, 'day')
  let resultsSortByInterviewer

  if (req.query.type === 'intraday') {
    resultsSortByInterviewer = await Assignment
      .aggregate({
        $match: {
          $and: [
            {deadline_date: {$lte: tomorrow.toDate()}},
            {deadline_date: {$gt: today.toDate()}},
          ],
        },
      }).group(
        {
          '_id': {
            interviewer_id: '$interviewer_id',
          },
          'deadline_dates': {
            $push: '$deadline_date',
          },
        },
      )
      .exec()
  }
  const resultList = await Promise.all(resultsSortByInterviewer.map(getBulletinItem))
  res.json(resultList)
}
