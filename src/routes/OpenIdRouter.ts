import { Router, Request, Response, NextFunction } from 'express'
import { getOpenId } from '../controllers/OpenIdController'

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
    this.router.get('/getOpenId', this.withErrorHandler(getOpenId))
  }
}

export default new OpenIdRouter().router
