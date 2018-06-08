import { Router } from 'express'
import { getRoles } from '../controllers/RoleController'

class RoleRouter {
  public router: Router

  constructor() {
    this.router = Router()
    console.info('role router execute.')
    this.init()
  }

  private init(): void {
    console.info('role router init.')
    this.router.get('/roles', getRoles)
  }
}

export default new RoleRouter().router
