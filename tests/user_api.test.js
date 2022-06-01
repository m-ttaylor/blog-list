const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const BlogUser = require('../models/user')

beforeEach(async () => {
  await BlogUser.deleteMany({})

  const passwordHash1 = await bcrypt.hash('memphis', 10)
  const user1 = new BlogUser({ 
    username: 'theking', 
    name: 'Elvis Presley',
    passwordHash: passwordHash1
  })

  await user1.save()

  const passwordHash2 = await bcrypt.hash('jamestown', 10)
  const user2 = new BlogUser({
    username: 'johnnyboy',
    name: 'John Smith',
    passwordHash: passwordHash2
  })

  await user2.save()
})



describe('when there are initially two users in the DB', () => {

  test('creation of a new user succeeds', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'blackbeard',
      name: 'Edward Teach',
      password: 'revenge'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('creation fails with proper status code if username has been taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'theking',
      name: 'Elvis Presley',
      password: 'different'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Short Lad',
      password: 'fdsvadsfd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'BlogUser validation failed: username: Path `username` (`ab`) is shorter than the minimum allowed length (3).'
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'insecurity',
      name: 'Reckless One',
      password: 'a'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'password must be at least 3 characters'
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})