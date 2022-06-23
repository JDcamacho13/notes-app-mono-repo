import React from 'react'
import PropTypes from 'prop-types'

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

Note.propTypes = {
  note: PropTypes.shape({
    content: PropTypes.string.isRequired,
    date: PropTypes.string,
    id: PropTypes.string,
    important: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  toggleImportance: PropTypes.func
}

export default Note
