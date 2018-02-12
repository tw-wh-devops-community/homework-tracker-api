import { Router, Request, Response, NextFunction } from 'express'
import {
  getBulletins,
} from '../controllers/BulletinController'

class BulletinRouter {
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
    this.router.get('/bulletins', this.withErrorHandler(getBulletins))

  }
}

export default new BulletinRouter().router
