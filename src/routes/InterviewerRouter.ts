import { Router, Request, Response, NextFunction } from 'express'
import { getInterviewers, createInterviewers, getInterviewersByName } from '../controllers/InterviewerController'

class InterviewerRouter {
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
    this.router.get('/interviewers', getInterviewers)
    this.router.get('/interviewers/:name', getInterviewersByName)
    this.router.post('/interviewers', this.withErrorHandler(createInterviewers))
  }
}

export default new InterviewerRouter().router
