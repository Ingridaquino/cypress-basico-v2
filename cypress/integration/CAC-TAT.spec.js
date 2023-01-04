// <reference tupes="Cypress" /> 

describe('Central de atendimento', function() {
    const SECOND = 3000;

    beforeEach(function(){
        cy.visit('./src/index.html')
    })

    it('verificar o título da aplicação', function() {
        cy.title('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    Cypress._.times(5, () => {
        it('preenche os campos obrigatórios e envia o formulário', function() {
            cy.clock()
            
            cy.get('#firstName').type('Ingrid')
            cy.get('#lastName').type('Aquino')
            cy.get('#email').type('ingrid@gmail.com')
            cy.get('#open-text-area').type('tesst tasaiossn sl;ajksods msaijka0sas maspioajk0a jsaiosajsas', { delay:0 } )
            cy.contains('button', 'Enviar').click()
    
            cy.get('.success').should('be.visible')
    
            cy.tick(SECOND)
    
            cy.get('.success').should('not.be.visible')
    
        })
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()
        
        cy.get('#firstName').type('Ingrid')
        cy.get('#lastName').type('Aquino')
        cy.get('#email').type('ingrid@gmailcom')
        cy.get('#open-text-area').type('tesst tasaiossn sl;ajksods msaijka0sas maspioajk0a jsaiosajsas', { delay:0 } )
        cy.contains('button', 'Enviar').click()
        
        cy.get('.error').should('be.visible')

        cy.tick(SECOND)

        cy.get('.error').should('not.be.visible')


    })
    
    it('campo de telefone continua vazio quando preenchido com valor não-numerico', function() {
        cy.get('#phone').type('abcdefrsghryeie').should('have.value', '')

    })
    
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        const longText = Cypress._.repeat('0123456789', 4)
        
        cy.get('#firstName').type('Ingrid')
        cy.get('#lastName').type('Aquino')
        cy.get('#email').type('ingrid@gmailcom')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type(longText, { delay:0 } )
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
            .type('Miguel')
            .should('have.value', 'Miguel')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', function() {
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o fomrlário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
        .select(1)
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .each(function($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('#check input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
            .then(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
        .selectFile('@sampleFile')
        .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })

    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })
      

      Cypress._.times(5, () => {
          it('preenche a area de texto usando o comando invoke', () => {
            const textLong = Cypress._.repeat('abcdefgh', 10)
      
            cy.get('#open-text-area')
            .invoke('val', textLong)
            .should('have.value', textLong)
          })
    })

    it('faz uma requisição HTTP', () => {
        const title = 'CAC TAT'
        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.statusText).to.equal('OK')
            expect(response.body).include(title)
        })
    })
        
    it.only('Encontre o gato', () => {
       cy.get('#cat')
       .invoke('show')
       .should('be.visible')
    })
})
