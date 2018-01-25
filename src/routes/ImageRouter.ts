import { Router } from 'express'
import {
  getImage,
} from '../controllers/ImageController'

class ImageRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/:id', getImage)
  }
}

export default new ImageRouter().router
