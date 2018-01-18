import { Router } from 'express'
import {
  getAllTasks,
  createTask,
} from '../controllers/TodoListController'

class TodoListRouter {
  router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/tasks', getAllTasks)
    this.router.post('/tasks', createTask)
  }
}

export default new TodoListRouter().router
