const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const BlogUser = require('../models/user')
const { userExtractor } = require('../utils/middleware')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(
    'user', { username: 1, name: 1 }
  )
  return response.json(blogs)
})


blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body, user } = request
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  if (body.title && body.author) {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const { user, params } = request
  const blogToDelete = await Blog.findById(params.id)

  if (user._id.toString() !== blogToDelete.user.toString()) {
    return response.status(401).json({
      'error': 'unauthorized'
    })
  }

  await Blog.findByIdAndRemove(params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    body,
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter

