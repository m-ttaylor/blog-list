const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const BlogUser = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)

  await BlogUser.deleteMany({})
  
  const userObjects = helper.initialUsers
    .map(user => new BlogUser(user))
  const userPromiseArray = userObjects.map(u => u.save())
  await Promise.all(userPromiseArray)

  const allUsers = await helper.usersInDb()
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

  const credentials = {
    username: 'theking',
    password: 'memphis'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(credentials)
    .expect('Content-Type', /application\/json/)

  const token = loginResponse.body.token

  const newBlog = {
    title: 'Antipatterns',
    author: 'Scoundrel',
    url: 'https://en.wikipedia.org/wiki/Anti-pattern',
    likes: 0,
  }

  const newBlogResponse = await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${token}` })
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Antipatterns')
})

test('likes default to 0 for a blog', async () => {
  const credentials = {
    username: 'theking',
    password: 'memphis'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(credentials)
    .expect('Content-Type', /application\/json/)

  const token = loginResponse.body.token
  
  const newBlog = {
    title: 'Very Sad',
    author: 'Villain',
    url: 'https://facebook.com'
  }

  const result = await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${token}` })
    .send(newBlog).expect(201)

  expect(result.body.likes).toBe(0)
})

describe('a blog without', () => {
  const credentials = {
    username: 'theking',
    password: 'memphis'
  }

  test('a title to be rejected by the server', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send(credentials)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const newBlog = {
      author: 'Bob',
      url: 'https://test.test'
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(newBlog)
      .expect(400)
  })

  test('an author to be rejected by the server', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(credentials)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    
    const newBlog = {
      title: 'Incognito',
      url: 'https://test.test'
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(newBlog)
      .expect(400)
  })
})

describe('logging in', () => {
  const credentials = { username: 'theking', password: 'memphis' }

  test('is successful with valid credentials', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    expect(token).toBeDefined()
  })
  
})

describe('deletion of a blog', () => {
  const credentials = {
    username: 'theking',
    password: 'memphis'
  }

  test('succeeds with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    const loginResponse = await api
      .post('/api/login')
      .send(credentials)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `bearer ${token}` })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('fails if user deleting is not the user that created the blog', async () => {
    const badCredentials = { username: 'hacker', password: 'password123' }
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const loginResponse = await api
      .post('/api/login')
      .send(badCredentials)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `bearer ${token}` })
      .expect(401)
  })
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