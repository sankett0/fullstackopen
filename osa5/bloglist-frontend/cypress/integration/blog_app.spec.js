describe('Blog app', function() {
  beforeEach(function(){      
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const testUser = {
        username: "testaaja",
        name: "Testi User",
        password: "asd123"
      }
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    beforeEach(function() {
      localStorage.clear()
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      cy.createUser({
        username: 'testaaja',
        name: 'Testi User',
        password: 'asd123'
      })
      cy.visit('http://localhost:3000')
    })
    
    
    it('is successful with correct credentials', function() {
      cy.get('input.username').type('testaaja')
      cy.get('input.password').type('asd123')
      cy.get('input.loginbutton').click()
      cy.contains('Testi User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input.username').type('testaaja')
      cy.get('input.password').type('wrong_password')
      cy.get('input.loginbutton').click()
      cy.contains('Login failed')
    })

  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testaaja', password: 'asd123' })
      cy.createBlog({
        title: 'joku blogi',
        author: 'Joku Vaan',
        url: 'www.test.com'
      })
    })

    it('blog can be created', function() {
      cy.contains('new note').click()
      cy.get('input.title').type('Testiblogi')
      cy.get('input.author').type('testi author')
      cy.get('input.url').type('www.google.com')
      cy.get('input.createbutton').click()
      cy.contains('Testiblogi')
      cy.contains('testi author')
      cy.contains('view')
    })

    it('blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.get('button.like').click()
      cy.contains('likes 1')
    })

    it('blog can be deleted', function() {
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.on('window:confirm', () => true);
      cy.contains('joku blogi deleted!')
      cy.contains('joku blogi Joku Vaan').should('not.exist')
    })

    it('blogs should be ordered from most to least likes', function() {
      cy.createBlog({
        title: 'toinen blogi',
        author: 'Joopa joo',
        url: 'www.test123.com'
      })
      cy.createBlog({
        title: 'kolmas blogi',
        author: 'Asd Dsa',
        url: 'asdasdasdasd'
      })
      
      // blogi1 
      cy.get('.blog').eq(0).contains('view').click()
      cy.contains('likes 0')
      cy.get('button.like').click()
      cy.contains('likes 1')
      cy.get('button.like').click()
      cy.contains('likes 2')
      cy.get('button.like').click()
      cy.contains('likes 2')
      cy.contains('close').click()
      // blog 3
      cy.get('.blog').eq(2).contains('view').click()
      cy.contains('likes 0')
      cy.get('button.like').click()
      cy.contains('likes 1')
      cy.get('button.like').click()
      cy.contains('likes 2')
      
      cy.get('.blog').eq(0).contains('joku blogi')
      cy.get('.blog').eq(1).contains('kolmas blogi')
      cy.get('.blog').eq(2).contains('toinen blogi')

    })
  })
})