import {Response, Request} from 'express'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

export let getImage = async (req: Request, res: Response) => {
  try {
    dotenv.config()
    const env = process.env
    const nodeEnv = env.NODE_ENV
    const imageDirectoryPath = env[`UPLOAD_IMAGE_FILE_PATH_${nodeEnv.toUpperCase()}`]
    const imagePath = imageDirectoryPath + req.params.id + '.png'

    if (fs.existsSync(imagePath)) {
      res.setHeader('Content-Type', 'image/jpeg')
      fs.createReadStream(imagePath).pipe(res)
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.sendStatus(400);
  }
};
