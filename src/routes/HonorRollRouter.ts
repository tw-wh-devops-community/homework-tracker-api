import { Router, Request, Response, NextFunction } from 'express'
import {
  getHonorRolls,
} from '../controllers/HonorRollController'

class HonorRollRouter {
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
    this.router.get('/honorrolls', this.withErrorHandler(getHonorRolls))

  }
}

export default new HonorRollRouter().router
