import '@percy/cypress';

Cypress.Commands.add('login', (username, password) => {
  // Open the login page, fill in the form with username and password and submit.
  return (
    cy
      .request({method: 'POST', url: '/login', followRedirect: true})
      // This is not a real promise
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => {
        const _el = document.createElement('html');
        _el.innerHTML = response.body;
        // This should be more strict depending on your login page template.
        const loginForm = _el.querySelectorAll('form');
        const isAlreadyLoggedIn = !loginForm.length;
        if (isAlreadyLoggedIn) {
          return;
        }

        return cy.request({
          form: true,
          method: 'POST',
          url: loginForm[0].action,
          followRedirect: true,
          body: {
            username,
            password
          }
        });
      })
  );
});

Cypress.Commands.add('logout', () => {
  cy.request('/logout');
});
