const mongoose = require('mongoose')
const Note = require('../models/Note')
const User = require('../models/User')
const { initialNotes, api, getAllContentFromNotes, getNewPassHash, loggin } = require('./helpers')

jest.setTimeout(10 * 1000)

beforeEach(async () => {
  await Note.deleteMany({})

  // save all the notes whit promises but not is sequential
  // const notesObjects = initialNotes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)
  const newUser = new User({
    username: 'JDcamacho',
    name: 'Daniel',
    passwordHash: await getNewPassHash('pssw')
  })

  await newUser.save()

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('API notes route GET', () => {
  test('notes are returned in JSON', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('route GET returned 2 notes', async () => {
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('one note is about testing', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('apendiendo con testing 😎')
  })

  test('find one note', async () => {
    const { response } = await getAllContentFromNotes()
    const { body: notes } = response
    const [firstNote] = notes
    const result = await api
      .get(`/api/notes/${firstNote.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.content).toBe(initialNotes[0].content)
  })

  test('find one note whit malformatted id', async () => {
    await api
      .get('/api/notes/21654')
      .expect(400)
  })

  test('find one note whit a id that does not exist', async () => {
    await api
      .get('/api/notes/62a7d088aabf9a3470e82d69')
      .expect(404)
  })
})

describe('API notes route POST', () => {
  test('a valid note can be added', async () => {
    const token = await loggin()

    const newNote = {
      content: 'Todavia tengo que hacer el potfolio 😥',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { response, contents } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('note whithout content is not added', async () => {
    const token = await loggin()

    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(newNote)
      .expect(400)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('API notes route DELETE', () => {
  test('a note can be deleted', async () => {
    const { response } = await getAllContentFromNotes()
    const { body: notes } = response
    const [noteToDelete] = notes
    const token = await loggin()

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const { response: secondResponse, contents } = await getAllContentFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that have a malformatted id', async () => {
    const token = await loggin()

    await api
      .delete('/api/notes/12545')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('a note that do not exist can not be deleted', async () => {
    const token = await loggin()
    await api
      .delete('/api/notes/62a7d088aabf9a3470e82d69')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('API notes route PUT', () => {
  test('update a note', async () => {
    const token = await loggin()
    const { response } = await getAllContentFromNotes()
    const { body: notes } = response
    const [noteToUpdate] = notes

    const newDataNote = {
      content: 'Cambiando valores 😋'
    }

    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(newDataNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const { response: responseSecond } = await getAllContentFromNotes()
    expect(responseSecond.body[0].content).toBe(newDataNote.content)
  })

  test('update a note that have a malformatted id', async () => {
    const token = await loggin()
    const { response: firstResponse } = await getAllContentFromNotes()

    const newDataNote = {
      content: 'Cambiando valores 😋'
    }

    await api
      .put('/api/notes/12545')
      .send(newDataNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const { response: secondResponse } = await getAllContentFromNotes()
    expect(firstResponse.body).toEqual(secondResponse.body)
  })

  test('update a note that do not exist can not be deleted', async () => {
    const token = await loggin()
    const newDataNote = {
      content: 'Cambiando valores 😋'
    }

    await api
      .put('/api/notes/62a7d088aabf9a3470e82d69')
      .send(newDataNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('update a note whithout content', async () => {
    const token = await loggin()
    await api
      .put('/api/notes/62a7d088aabf9a3470e82d69')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

afterAll(async () => {
  await Note.deleteMany({})
  mongoose.connection.close()
})
