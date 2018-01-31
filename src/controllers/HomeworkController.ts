import {Homework} from '../models/Homework'

export const getHomeworks = (req, res) => {
  Homework.find({}, (err, homework) => {
    if (err) {
      res.send(err)
    }
    res.json(homework)
  })
}

export const createHomework = (req, res) => {
  const newHomework = new Homework(req.body)
  newHomework.save((err, homework) => {
    if (err) {
      res.send(err)
    }
    res.json(homework)
  })
}

export const getHomework = (req, res) => {
  Homework.findById(req.params.homeworkId, (err, homework) => {
    if (err) {
      res.send(err)
    }
    res.json(homework)
  })
}
