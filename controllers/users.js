const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const BlogUser = require('../models/user')

usersRouter.post('/', async (request, response) => {

  const { username, name, password } = request.body

  const existingUser = await BlogUser.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters'
    })
  }

  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)

  const user = new BlogUser({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


usersRouter.get('/', async (request, response) => {
  const users = await BlogUser.find({}).populate(
    'blogs', { title: 1, author: 1, likes: 1, url: 1 }
  )

  response.json(users)
})

module.exports = usersRouter