import { Router } from 'express'
import { getRoles } from '../controllers/RoleController'

class RoleRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/roles', getRoles)
  }
}

export default new RoleRouter().router
