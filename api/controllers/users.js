const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
  const users = await User.find().populate('notes', {
    content: 1,
    date: 1,
    important: 1
  })
  res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  const { body } = req
  const { username, name, password } = body

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'content missing' })
  }

  const userValidator = await User.find({ username })

  if (userValidator.length > 0) {
    return res.status(400).json({ error: '`username` must to be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = usersRouter
