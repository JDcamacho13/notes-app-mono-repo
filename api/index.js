require('dotenv').config()
require('./mongo')
const express = require('express')
const loggerMiddleware = require('./loggerMiddleware')
const cors = require('cors')
const app = express()

const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

app.use(cors())
app.use(express.json())

app.use(loggerMiddleware)

app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)
app.use(notFound)

if (process.env.NODE_ENV !== 'test' || process.env.PORT !== undefined) {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = { app }
