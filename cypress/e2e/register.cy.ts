describe('Prueba E2E de Registro', () => {
  beforeEach(() => {
    // Interceptar la solicitud de registro para simular la respuesta del backend
    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: {},
    }).as('registerRequest');

    cy.visit('/auth/register');
  });

  it('debe tener el botón de enviar deshabilitado inicialmente', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debe validar un correo electrónico no válido y mostrar el error', () => {
    cy.get('input[placeholder="email@email.com"]').type('invalid-email').blur();
    cy.get('mat-error').should('contain', 'El correo no tiene un formato correcto');
  });

  it('debe validar una contraseña demasiado corta', () => {
    cy.get('input[placeholder="*******"]').first().type('12345').blur();
    cy.get('mat-error').should('contain', 'Debe tener al menos 8 caracteres');
  });

  it('debe validar que las contraseñas coincidan', () => {
    cy.get('input[placeholder="Marta Martínez"]').type('Marta');
    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').first().type('Password123');
    cy.get('input[placeholder="*******"]').last().type('Password456').blur();
    cy.get('mat-error').should('contain', 'Las contraseñas no coinciden');
  });

  it('debe registrarse correctamente con datos válidos', () => {
    cy.get('input[placeholder="Marta Martínez"]').type('Marta Martínez');
    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').first().type('Password123');
    cy.get('input[placeholder="*******"]').last().type('Password123').blur();

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Verificar que el payload correcto se envió al backend
    cy.wait('@registerRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        name: 'Marta Martínez',
        email: 'marta@example.com',
        password: 'Password123',
      });
    });

    // Verificar redirección a la página de login y snackbar de éxito
    cy.url().should('include', '/auth/login');
    cy.contains('Usuario registrado correctamente').should('be.visible');
  });
});
