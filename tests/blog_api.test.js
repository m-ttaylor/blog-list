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

describe('deletion of a blog', () => {
  
  test('succeeds with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  // test('')
})

describe('updating of a blog post', () => {
  test('suceeds when updating the likes for a post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const initialLikes = blogToUpdate.likes

    const changedBlog = {
      ...blogToUpdate,
      likes: initialLikes + 1
    }
    
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    console.log(blogsAtEnd)
    expect(blogsAtEnd[0].likes).toBe(initialLikes + 1)
  })

  test('fails when updating an invalid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const invalidId = 'dfasdfasdr231'

    const changedBlog = {
      ...blogToUpdate,
      author: 'Bad Id'
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(changedBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})