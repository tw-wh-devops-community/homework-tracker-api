import Homework from '../models/Homework'

export const getHomeworks = (req, res) => {
  Homework.find({}, (err, task) => {
    if (err) res.send(err)
    res.json(task)
  })
}

export const createHomework = (req, res) => {
  const newHomework = new Homework(req.body)
  newHomework.save((err, task) => {
    if (err) res.send(err)
    res.json(task)
  })
}

export const getHomework = (req, res) => {
  Homework.findById(req.params.taskId, (err, task) => {
    if (err) res.send(err)
    res.json(task)
  })
}
