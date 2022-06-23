const mongoose = require('mongoose')
const User = require('../models/User')
const { api, getNewPassHash, getUsers } = require('./helpers')

jest.setTimeout(10 * 1000)

beforeEach(async () => {
  await User.deleteMany({})

  const newUser = new User({
    username: 'JDcamacho',
    name: 'Daniel',
    passwordHash: await getNewPassHash('pssw')
  })

  await newUser.save()
})

describe('POST', () => {
  test('create a user correctly', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'Daniel13',
      name: 'José Daniel',
      password: 'Perro1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if usernames is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: usersAtStart[0].username,
      name: usersAtStart[0].name,
      password: 'Perro1234'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toBe('`username` must to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  mongoose.connection.close()
})
