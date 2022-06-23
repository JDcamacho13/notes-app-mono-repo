import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Note from './Note'

describe('<Note />', () => {
  test('renders content', () => {
    const note = {
      content: 'Esto es un test con jest',
      important: true
    }

    const toggleImportantButtonText = (important) => important ? 'make not important' : 'make important'

    const component = render(<Note note={note} />)

    // component.getByText(note.content)
    // component.getByText('make not important')

    expect(component.container).toHaveTextContent(note.content)
    expect(component.container).toHaveTextContent(toggleImportantButtonText(note.important))
  })

  test('clicking make important button calls toggleImportance once', () => {
    const note = {
      content: 'Esto es un test con jest',
      important: true
    }

    const toggleImportantButtonText = (important) => important ? 'make not important' : 'make important'

    const mockHandler = jest.fn()

    const component = render(<Note note={note} toggleImportance={mockHandler} />)

    const button = component.getByText(toggleImportantButtonText(note.important))
    fireEvent.click(button)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
