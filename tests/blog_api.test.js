const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  console.log(helper.initialBlogs)
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})

test('can get the right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)

})

test('id field is named correctly', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id.toBeDefined)
})

afterAll(() => {
  mongoose.connection.close()
})