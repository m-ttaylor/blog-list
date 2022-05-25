const app = require('./app')
const http = require('http')
const config = require('./utils/config')
// const logger = require('./utils/logger')

const server = http.createServer(app)

// const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = 'mongodb://localhost/bloglist'


server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})