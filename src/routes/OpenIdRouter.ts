import { Router, Request, Response, NextFunction } from 'express'
import {getOpenId, getHomeworkInfoForWeChat, addBind, removeBind} from '../controllers/OpenIdController'
import {getUnbindInterviewers} from '../controllers/InterviewerController'

class OpenIdRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private withErrorHandler(apiHandler): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await apiHandler(req, res)
      } catch (err) {
        next(err)
      }
    }
  }

  private init(): void {
    this.router.get('/openId?', this.withErrorHandler(getOpenId))
    this.router.get('/assignment/:interviewerId', this.withErrorHandler(getHomeworkInfoForWeChat))
    this.router.post('/openId', this.withErrorHandler(addBind))
    this.router.delete('/openId', this.withErrorHandler(removeBind))
    this.router.get('/interviewer/unbind', this.withErrorHandler(getUnbindInterviewers))
  }
}

export default new OpenIdRouter().router
