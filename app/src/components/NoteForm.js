import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Togglable from './Togglable'

const NoteForm = ({ addNote, handleLogout }) => {
  const [newNote, setNewNote] = useState('')
  const togglableRef = useRef()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: false
    }

    await addNote(noteObject)
    setNewNote('')
    togglableRef.current.toggleVisibility()
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  return (
    <Togglable buttonLabelHide='Hide note' buttonLabelShow='Add new note' ref={togglableRef}>
      <h3>Create a new note</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder='write a note...'
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </Togglable>
  )
}

NoteForm.propTypes = {
  addNote: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired
}

export default NoteForm
