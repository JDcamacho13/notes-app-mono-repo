import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  const buttonLabelShow = 'Show'
  const buttonLabelHide = 'Hide'
  let component

  beforeEach(() => {
    component = render(<Togglable buttonLabelHide={buttonLabelHide} buttonLabelShow={buttonLabelShow} >
      <div>testDivContent</div>
    </Togglable>)
  })

  test('renders its children', () => {
    expect(component.container).toHaveTextContent('testDivContent')
  })

  test('renders its children', () => {
    const el = component.getByText('testDivContent')
    expect(el.parentNode).toHaveStyle('display: none')
  })

  test('After clicking its children must be show', () => {
    const button = component.getByText(buttonLabelShow)
    fireEvent.click(button)
    const el = component.getByText('testDivContent')
    expect(el.parentNode).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', () => {
    const button = component.getByText(buttonLabelShow)
    fireEvent.click(button)

    const cancelButton = component.getByText(buttonLabelHide)
    fireEvent.click(cancelButton)

    const el = component.getByText('testDivContent')
    expect(el.parentNode).toHaveStyle('display: none')
  })
})
