const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unkown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  let token
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  } else {
    token = null
  }

  request.token = token
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}