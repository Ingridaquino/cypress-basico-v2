Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Ingrid')
    cy.get('#lastName').type('Aquino')
    cy.get('#email').type('ingridaquino@sonda.com')
    cy.get('#open-text-area').type('testt')
    cy.contains('button', 'Enviar').click()

})
