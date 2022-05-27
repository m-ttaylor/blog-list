const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Antipatterns',
    author: 'Scoundrel',
    url: 'https://en.wikipedia.org/wiki/Anti-pattern',
    likes: 0,
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Antipatterns')
})

test('likes default to 0 for a blog', async () => {
  const newBlog = {
    title: 'Very Sad',
    author: 'Villain',
    url: 'https://facebook.com'
  }

  const result = await api.post('/api/blogs').send(newBlog).expect(201)
  console.log(result.body)
  expect(result.body.likes).toBe(0)
})

describe('a blog without', () => {
  
  test('a title to be rejected by the server', async () => {
    const newBlog = {
      author: 'Bob',
      url: 'https://test.test'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('an author to be rejected by the server', async () => {
    const newBlog = {
      title: 'Incognito',
      url: 'https://test.test'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})