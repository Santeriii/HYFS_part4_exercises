const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  try {
    if (user.username && user.name) {
        const savedUser = await user.save()
        response.json(savedUser.toJSON())
    } else {
      response.status(400).end()
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = usersRouter