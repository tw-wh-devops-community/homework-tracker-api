import Task from '../models/TodoListModel'

export const getAllTasks = (req, res) => {
  Task.find({}, (err, task) => {
    if (err) res.send(err)
    res.json(task)
  })
}

export const createTask = (req, res) => {
  const newTask = new Task(req.body)
  newTask.save((err, task) => {
    if (err) res.send(err)
    res.json(task)
  })
}

export const getTask = (req, res) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err) res.send(err)
    res.json(task)
  })
}
