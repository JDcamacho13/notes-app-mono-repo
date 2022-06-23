const notesRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id).populate('user', {
      username: 1,
      name: 1
    })
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params

  try {
    const removedNote = await Note.findByIdAndRemove(id)
    if (removedNote) {
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  const { content, important } = req.body

  if (!content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const newNoteInfo = {
    content,
    important: typeof important === 'undefined' ? false : important
  }

  try {
    const note = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).populate('user', {
      username: 1,
      name: 1
    })

    console.log(note)

    if (note) {
      res.status(200).json(note)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body
  const { userId } = req

  if (!content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const note = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
