import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as fs from 'fs'
import * as rfs from 'rotating-file-stream'
import dbHelper from './helpers/DBHelper'
import envHelper from './helpers/EnvHelper'
import BulletinRouter from './routes/BulletinRouter'
import AssignmentRouter from './routes/AssignmentRouter'
import ImageRouter from './routes/ImageRouter'
import InterviewerRouter from './routes/InterviewerRouter'
import RoleRouter from './routes/RoleRouter'
import HonorRollRouter from './routes/HonorRollRouter'
import SecretCodeRouter from './routes/SecretCodeRouter'
import ENV from './constants/Env'
import { LOG_DIRECTORY, LOG_FILE } from './constants/LogConfig'

// 小程序的Router
import OpenIdRouter from './routes/OpenIdRouter'
import {startNotifyTask} from './services/NotifyService';

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    dbHelper.connect()
    this.middleware()
    this.routes()
    this.handleError()
    startNotifyTask()
  }

  private middleware(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cors())
    if (envHelper.getNodeEnv() !== ENV.PROD) {
      this.app.use(morgan('combined'))
    } else {
      const accessLogStream = this.getRFSAccessLogStream()
      this.app.use(morgan('combined', {stream: accessLogStream}))
    }
  }

  private getRFSAccessLogStream(): any {
    const logDirectory = LOG_DIRECTORY

    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory)
    }

    const accessLogStream = rfs(LOG_FILE, {
      size:     '10M',
      interval: '10d',
      compress: 'gzip',
      maxFiles: 10,
      path: logDirectory,
    })
    return accessLogStream
  }

  private routes() {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({ message: 'Hello World!' })
    })
    this.app.use('/', router)
    this.app.use('/image', ImageRouter)
    this.app.use('/api', AssignmentRouter)
    this.app.use('/api', InterviewerRouter)
    this.app.use('/api', RoleRouter)
    this.app.use('/api', BulletinRouter)
    this.app.use('/api', HonorRollRouter)
    this.app.use('/api', SecretCodeRouter)
    // 小程序的交易
    this.app.use('/pweb', OpenIdRouter)

    this.app.use((err: any, req: Request, res, next) => {
      res.status(err.status || 500).json(err).send()
    })
  }

  private handleError(): void {
    this.app.use((req, res) => {
      res.status(404).send({ url: req.originalUrl + ' not found.' })
    })
  }
}

export default new App().app
