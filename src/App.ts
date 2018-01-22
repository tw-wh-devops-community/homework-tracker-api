import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as mongoose from 'mongoose'
import * as morgan from 'morgan'
import HomeworkRouter from './routes/HomeworkRouter'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.connectDatabase()
    this.middleware()
    this.routes()
    this.handleError()
  }

  private connectDatabase(): void {
    const db = `mongodb://localhost/homework-tracker-${process.env.NODE_ENV}`
    mongoose.connect(db, { useMongoClient: true })
  }

  private middleware(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(morgan('combined'))
  }

  private routes() {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({ message: 'Hello World!' })
    })
    this.app.use('/', router)
    this.app.use('/api', HomeworkRouter)
  }

  private handleError(): void {
    this.app.use((req, res) => {
      res.status(404).send({ url: req.originalUrl + ' not found.' })
    })
  }
}

export default new App().app
