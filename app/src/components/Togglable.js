import React, { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, buttonLabelShow = 'Show', buttonLabelHide = 'Hide' }, ref) => {
  const [visible, setVisible] = useState(false)

  const hidenWhenVisible = { display: visible ? 'none' : '' }
  const shownWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => ({
    toggleVisibility
  }))

  return (
    <>
      <div style={hidenWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabelShow}</button>
      </div>
      <div style={shownWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>{buttonLabelHide}</button>
      </div>
    </>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabelShow: PropTypes.string,
  buttonLabelHide: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default Togglable
