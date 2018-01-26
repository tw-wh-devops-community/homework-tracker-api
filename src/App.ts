import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as morgan from 'morgan'
import * as cors from 'cors'
import dbHelper from './helpers/DBHelper'
import HomeworkRouter from './routes/HomeworkRouter'
import ImageRouter from './routes/ImageRouter'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    dbHelper.connect()
    this.middleware()
    this.routes()
    this.handleError()
  }

  private middleware(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cors())
    this.app.use(morgan('combined'))
  }

  private routes() {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({ message: 'Hello World!' })
    })
    this.app.use('/', router)
    this.app.use('/api', HomeworkRouter)
    this.app.use('/image', ImageRouter)
  }

  private handleError(): void {
    this.app.use((req, res) => {
      res.status(404).send({ url: req.originalUrl + ' not found.' })
    })
  }
}

export default new App().app
