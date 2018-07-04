import * as request from 'request'
import { notifyUnfinshTask } from '../controllers/AssignmentController'
import * as schedule from 'node-schedule'

export const sendNotify = (wxId: string, message: string, isJump: string) => {
  console.log(`sendNotify called, wxId:${wxId}, message:${message}\nisJump:${isJump}`);

  const requestUrl: string = `http://localhost:5000/pyapi/realTimeNotify`;
  const formData: object = { wxId, message, isJump };
  return new Promise((resolve, reject) => {
    request({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
      json: true
    }, async (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve({ code: body.returnCode, msg: body.returnMsg })
      } else {
        reject({ code: 500, msg: 'notify failed', error })
      }
    })
  })
}

const sendNotifys = (): any => {
  return ['NewHomework', 'CompleteHomework', 'UpdateInterviewer', 'UpdateDeadline', 'DeleteHomework'].reduce((result, key) => {
    return result[`send${key}Notify`] = sendNotify, result
  }, {})
}

export const startNotifyTask = () => {
    const time = '0 0 10,20 * * *'
    schedule.scheduleJob(time, () => {
      notifyUnfinshTask()
    })
}

export default sendNotifys()