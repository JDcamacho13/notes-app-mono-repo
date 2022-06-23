import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Togglable from './Togglable'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    await handleLogin(username, password)
  }

  return (
    <>
      <Togglable buttonLabelShow='Show login' buttonLabelHide='Hide login'>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type='text'
              value={username}
              name='username'
              placeholder='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <input
              type='password'
              value={password}
              name='password'
              placeholder='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button>Login</button>
        </form>
      </Togglable>
    </>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
