const express = require('express')
require('./src/db/mongoose')
const Task = require('./src/models/task')
const User = require('./src/models/user')

const app = express()
const port = 3000

app.use(express.json())

app.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body)
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.patch('/tasks/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      return res.status(400).send()
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    res.send({ Response: 'Task id: ' + task.id + ' deleted.' })
  } catch (e) {
    res.status(500).send()
  }
})

app.post('/users', async (req, res) => {
  try{
    const user = await User.create(req.body)
    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.patch('/users/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      return res.status(400).send()
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).send()
    }

    updates.forEach(element => user[element] = req.body[element] );

    await user.save()    

    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).send()
    }

    res.send({ Response: 'User id: ' + user.id + ' deleted.' })
  } catch (e) {
    res.status(500).send(e)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})