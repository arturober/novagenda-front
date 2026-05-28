describe('Prueba E2E de Inicio de Sesión', () => {
  beforeEach(() => {
    // Interceptar la solicitud de login para simular la respuesta del backend
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        idRefresh: 'mock-id-refresh',
      },
    }).as('loginRequest');

    // Interceptar el perfil de usuario cargado al iniciar sesión
    cy.intercept('GET', '**/users/profile/mine', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Marta Martínez',
        email: 'marta@example.com',
      },
    }).as('profileRequest');

    // Interceptar llamadas de tareas para evitar errores en la carga de la vista posterior al login
    cy.intercept('GET', '**/tasks**', {
      statusCode: 200,
      body: [],
    }).as('tasksRequest');

    cy.visit('/auth/login');
  });

  it('debe tener el botón de login deshabilitado inicialmente', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debe validar un correo electrónico no válido y mostrar el error', () => {
    cy.get('input[placeholder="email@email.com"]').type('invalid-email').blur();
    cy.get('mat-error').should('contain', 'El correo no tiene un formato correcto');
  });

  it('debe validar que los campos obligatorios muestren error si se dejan vacíos', () => {
    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').type('12345').clear().blur();
    cy.get('mat-error').should('contain', 'Campo obligatorio');
  });

  it('debe iniciar sesión correctamente con credenciales válidas y redirigir', () => {
    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').type('Password123').blur();

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Verificar que la petición de login se realizó con el cuerpo correcto
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        email: 'marta@example.com',
        password: 'Password123',
      });
    });

    // Verificar que se solicitó el perfil de usuario
    cy.wait('@profileRequest');

    // Verificar que redirige a la página principal de tareas
    cy.url().should('include', '/tasks');
  });

  it('debe mostrar error de snackbar si las credenciales son incorrectas', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        message: 'Credenciales incorrectas',
      },
    }).as('failedLoginRequest');

    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').type('WrongPassword').blur();

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@failedLoginRequest');

    // Verificar snackbar de error
    cy.contains('Credenciales incorrectas').should('be.visible');
  });
});
