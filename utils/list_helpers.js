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

  return blogs.reduce((result, { author, title, likes }) => {
    return likes === mostLikes
      ? { author, title, likes } : result
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

  const countLikes = (blogs) => _.sumBy(blogs, (blog) => blog.likes)

  const allAuthors = blogs.reduce((authors, blog) => {
    return !authors.includes(blog.author)
      ? authors.concat(blog.author)
      : authors
  }, [])
  console.log('all authors are', allAuthors)

  const likeTotals = []
  allAuthors.forEach(author => {
    const likes = countLikes(blogs.filter(blog => blog.author === author))
    likeTotals.push({
      author: author,
      likes: likes
    })
  })

  console.log('likes totals are', likeTotals)
  const highestLikes = Math.max(...likeTotals.map(i => i.likes))

  return likeTotals.find(total => total.likes === highestLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}