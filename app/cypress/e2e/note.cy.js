const user = {
  name: 'Daniel',
  username: 'JDcamacho',
  password: '123456'
}

describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')

    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    cy.request('POST', 'http://localhost:3001/api/users', user)
  })

  it('frontpage can be opened', () => {
    cy.contains('Notes')
  })

  it('login form can be opened', () => {
    cy.contains('Show login').click()
    cy.get('input[name="username"]').should('be.visible')
  })

  it('login works correctly', () => {
    cy.intercept({
      method: 'POST',
      url: 'http://localhost:3001/api/login'
    }).as('loginResponse')

    cy.contains('Show login').click()
    cy.get('input:first').type(user.username)
    cy.get('input:last').type(user.password)
    cy.get('button').contains('Login').click()

    cy.wait('@loginResponse').its('response.statusCode').should('equal', 200)

    cy.get('button').contains('Add new note').should('be.visible')
  })

  it('login fails with wrong credentials', () => {
    cy.intercept({
      method: 'POST',
      url: 'http://localhost:3001/api/login'
    }).as('loginResponse')

    cy.contains('Show login').click()
    cy.get('input:first').type('adasdads')
    cy.get('input:last').type('adasdads')
    cy.get('button').contains('Login').click()

    cy.wait('@loginResponse').its('response.statusCode').should('equal', 401)

    cy.get('.error')
      .should('contain', 'Wrong credentials')
  })

  describe('When logged In', () => {
    beforeEach(() => {
      cy.login({ username: user.username, password: user.password })
    })

    it('a note can be created', () => {
      const waitTime = 1000
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(waitTime)
      const noteContent = 'This is a note created by cypress'
      cy.get('button').contains('Add new note').click()

      cy.get('input:first').type(noteContent)
      cy.contains('save').click()

      cy.contains(noteContent)
    })

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({ content: 'This is the first', important: false })
        cy.createNote({ content: 'This is the second', important: false })
        cy.createNote({ content: 'This is the third', important: false })
      })

      it('it can be made important', () => {
        cy.contains('This is the second').as('theNote')

        cy
          .get('@theNote')
          .contains('make important')
          .click()

        cy.get('@theNote').contains('make not important')
      })
    })
  })
})
