import {Response, Request} from 'express'
import * as fs from 'fs'

export let getImage = async (req: Request, res: Response) => {
  try {
    const imagePath = './upload/' + req.params.id + '.png'

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
