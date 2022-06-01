const Blog = require('../models/blog')
const BlogUser = require('../models/user')

const initialBlogs = [
  {
    _id: '62979c3ea2ab4c37edac1239',
    title: 'first blog',
    'author':'bobby crank',
    'url':'fddsfsdf',
    'likes': 1,
    'user': '629781b6fb59b201a700984a',
    '__v': 0
  },
  {
    _id: '62979c45a2ab4c37edac123f',
    title: 'second blog',
    author: 'bobby crank',
    url: 'fddsfsdf',
    likes: 1,
    user: '629781b6fb59b201a700984a',
    __v: 0
  },
  {
    _id: '62979c87e88713d610a8eaf0',
    title: 'One more blog',
    author: 'bobby crank',
    url: 'fddsfsdf',
    likes: 5,
    user: '629781b6fb59b201a700984a',
    __v: 0
  }
]

const a = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const initialUsers= [
  {
    username: 'theking',
    name: 'Elvis Presley',
    password: 'memphis',
    passwordHash: '$2b$10$TU9KLmzXV8Del8/SOSuPr.SoWtSm8nyC3JfomnzLxTwXb5DPkEIF.',
    _id: '629781b6fb59b201a700984a'
  },
  {
    username: 'hacker',
    name: 'unimportant',
    password: 'password123',
    passwordHash: '$2b$10$gwU9OQ.YbcEcrKtScO9zyuOZo33z5qBedsLwawqH.ImizxFSSckTC',
    _id: '6297d2d853b2c4887463088b'
  }
]

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await BlogUser.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb
}