import { Router } from 'express'
import { getInterviewers } from '../controllers/InterviewerController'

class InterviewerRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/interviewers', getInterviewers)
  }
}

export default new InterviewerRouter().router
