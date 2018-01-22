import { Router } from 'express'
import {
  getHomeworks,
  createHomework,
} from '../controllers/HomeworkController'

class HomeworkRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/homeworks', getHomeworks)
    this.router.post('/homeworks', createHomework)
  }
}

export default new HomeworkRouter().router
