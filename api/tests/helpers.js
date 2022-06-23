const bcrypt = require('bcrypt')
const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')
const api = supertest(app)

const getNewPassHash = async (pass) => {
  const passHash = await bcrypt.hash(pass, 10)
  return passHash
}

const initialNotes = [
  {
    content: 'apendiendo con testing 😎',
    important: true,
    date: new Date()
  },
  {
    content: 'Usando jest y supertest 😜',
    important: false,
    date: new Date()
  }
]

const getUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return { response, contents: response.body.map(note => note.content) }
}

const loggin = async () => {
  const loginData = {
    username: 'JDcamacho',
    password: 'pssw'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginData)

  const { token } = loginResponse.body
  return token
}

module.exports = {
  initialNotes,
  api,
  getAllContentFromNotes,
  getNewPassHash,
  getUsers,
  loggin
}
