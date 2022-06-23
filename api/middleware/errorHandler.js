const ERROR_HANDLER = {
  CastError: res => res.status(400).send({ error: 'malformatted id' }),

  JsonWebTokenError: res => res.status(401).json({ error: 'token missing or invalid' }),

  TokenExpiredError: res => res.status(401).json({ error: 'token expirer' }),

  defaultError: res => res.status(500).send({ error: 'something went wrong' })
}

module.exports = (error, req, res, next) => {
  console.error(error)
  const handler = ERROR_HANDLER[error.name] || ERROR_HANDLER.defaultError
  handler(res)
}
