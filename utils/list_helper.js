const _ = require('lodash')

const dummy = (blogs) => {
  // ...
  console.log(blogs.length)
  return 1
}

const totalLikes = (blogs) => {

  return blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((highest, blog) => Math.max(highest, blog.likes), 0)

  return blogs.reduce((result, blog) => {
    if (blog.likes === mostLikes) {
      result.author = blog.author
      result.title = blog.title
      result.likes = blog.likes
    }
    // console.log(result)
    return result
  }, {})
}

const mostBlogs = (blogs) => {

  const counts = _.countBy(blogs, (blog) => blog.author)

  const authorWithMostBlogs = Object.keys(counts).reduce((max, key) => {
    return max > counts[key]
      ? {
        author: key,
        blogs: max
      }
      : {
        author: key,
        blogs: counts[key]
      }
  }, {})

  console.log(authorWithMostBlogs)

  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  const totalLikes = _.groupBy(blogs, blog => Math.max(blog.likes))
  console.log('totalLikes:', totalLikes)
  const likeCounts = _.countBy(blogs, (blog) => blog.likes)
  console.log('like counts:', likeCounts)
  return blogs.reduce((max, blog) => {
    return max > blog.likes
      ? {
        author: blog.author,
        likes: max
      }
      : {
        author: blog.author,
        likes: blog.likes
      }
  }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}