import { Router, Request, Response, NextFunction } from 'express'
import {insertSecretCode, updateSecretCode} from '../controllers/SecretCodeController'

class SecretCodeRouter {
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
        this.router.put('/secret_code', this.withErrorHandler(updateSecretCode))
        this.router.post('/secret_code', this.withErrorHandler(insertSecretCode))
    }
}

export default new SecretCodeRouter().router
