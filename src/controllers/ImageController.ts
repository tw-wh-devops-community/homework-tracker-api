import { Response, Request } from 'express'
import * as fs from 'fs'
import envHelper from '../helpers/EnvHelper'

export let getImage = async (req: Request, res: Response) => {
  try {
    const nodeEnv = envHelper.getNodeEnv()
    const imageDirectoryPath = envHelper.getEnvProperty(`UPLOAD_IMAGE_FILE_PATH_${nodeEnv}`)
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
