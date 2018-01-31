import { Router } from 'express'
import {
  getHomeworks,
  createHomework,
} from '../controllers/HomeworkController'

import {
  createAssignment,
  deleteAssignment,
  listAssignments,
  getAssignmentById,
} from '../controllers/AssignmentController'

class HomeworkRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/homeworks', getHomeworks)
    this.router.post('/homeworks', createHomework)

    this.router.get('/assignment', listAssignments)
    this.router.get('/assignment/:id', getAssignmentById)
    this.router.post('/assignment', createAssignment)
    this.router.delete('/assignment/:id', deleteAssignment)
  }
}

export default new HomeworkRouter().router
