describe('Prueba E2E de Tareas', () => {
  let haCreadoTareaSimple = false;
  let haCreadoTareaCompleta = false;

  beforeEach(() => {
    haCreadoTareaSimple = false;
    haCreadoTareaCompleta = false;

    // Interceptar la validación de sesión
    cy.intercept('GET', '**/auth/validate', {
      statusCode: 200,
      body: {},
    }).as('validateRequest');

    // Interceptar la obtención de perfil del usuario
    cy.intercept('GET', '**/users/profile/mine', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Marta Martínez',
        email: 'marta@example.com',
      },
    }).as('profileRequest');

    // Interceptar categorías
    cy.intercept('GET', 'http://localhost:3000/categories', {
      statusCode: 200,
      body: {
        categories: [],
      },
    }).as('getCategoriesRequest');

    // Interceptar la obtención de la lista de tareas de forma dinámica (con estado)
    cy.intercept('GET', 'http://localhost:3000/tasks', (req) => {
      const tasks = [];
      if (haCreadoTareaSimple) {
        tasks.push({
          id: 'task-123',
          title: 'Mi nueva tarea simple',
          description: null,
          priority: 'MEDIUM',
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
          rrule: null,
          owner: {
            id: 1,
            name: 'Marta Martínez',
            email: 'marta@example.com',
          },
          isActive: true,
          category: null,
          interactions: [],
        });
      }
      if (haCreadoTareaCompleta) {
        tasks.push({
          id: 'task-456',
          title: 'Tarea completa con fecha',
          description: 'Esta es una tarea con todos los campos rellenos',
          priority: 'HIGH',
          startDate: '2026-08-01',
          endDate: null,
          startTime: null,
          endTime: null,
          rrule: null,
          owner: {
            id: 1,
            name: 'Marta Martínez',
            email: 'marta@example.com',
          },
          isActive: true,
          category: null,
          interactions: [],
        });
      }

      req.reply({
        statusCode: 200,
        body: {
          tasks,
        },
      });
    }).as('getTasksRequest');

    // Interceptar la creación de una tarea simple
    cy.intercept('POST', 'http://localhost:3000/tasks', (req) => {
      const isSimple = req.body.title === 'Mi nueva tarea simple';
      if (isSimple) {
        haCreadoTareaSimple = true;
        req.reply({
          statusCode: 201,
          body: {
            task: {
              id: 'task-123',
              title: 'Mi nueva tarea simple',
              description: null,
              priority: 'MEDIUM',
              startDate: null,
              endDate: null,
              startTime: null,
              endTime: null,
              rrule: null,
              owner: {
                id: 1,
                name: 'Marta Martínez',
                email: 'marta@example.com',
              },
              isActive: true,
              category: null,
              interactions: [],
            },
            mine: true,
          },
        });
      } else {
        haCreadoTareaCompleta = true;
        req.reply({
          statusCode: 201,
          body: {
            task: {
              id: 'task-456',
              title: 'Tarea completa con fecha',
              description: 'Esta es una tarea con todos los campos rellenos',
              priority: 'HIGH',
              startDate: '2026-08-01',
              endDate: null,
              startTime: null,
              endTime: null,
              rrule: null,
              owner: {
                id: 1,
                name: 'Marta Martínez',
                email: 'marta@example.com',
              },
              isActive: true,
              category: null,
              interactions: [],
            },
            mine: true,
          },
        });
      }
    }).as('createTaskRequest');

    // Interceptar la obtención de detalles de una tarea específica
    cy.intercept('GET', 'http://localhost:3000/tasks/task-456*', {
      statusCode: 200,
      body: {
        task: {
          id: 'task-456',
          title: 'Tarea completa con fecha',
          description: 'Esta es una tarea con todos los campos rellenos',
          priority: 'HIGH',
          startDate: '2026-08-01',
          endDate: null,
          startTime: null,
          endTime: null,
          rrule: null,
          owner: {
            id: 1,
            name: 'Marta Martínez',
            email: 'marta@example.com',
          },
          isActive: true,
          category: null,
          interactions: [],
        },
        mine: true,
      },
    }).as('getSingleTaskRequest');

    // Visitar la página de tareas configurando el token de sesión en localStorage antes de cargar
    cy.visit('/tasks', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('accessToken', 'mock-access-token');
      },
    });
  });

  it('debe permitir crear una tarea simple desde el diálogo y listarla en la lista de tareas sin fecha', () => {
    cy.url().should('include', '/tasks/list');
    cy.wait('@getTasksRequest');
    cy.get('task-item').should('not.exist');

    // Abrir el diálogo
    cy.get('button[aria-label="Añadir tarea"]').should('be.visible').click();
    cy.contains('h2', 'Nueva tarea').should('be.visible');

    // Introducir título y crear
    cy.get('input[placeholder="Nueva tarea"]').should('be.visible').type('Mi nueva tarea simple');
    cy.contains('button', 'Crear').should('not.be.disabled').click();

    // Validar creación y recarga
    cy.wait('@createTaskRequest');
    cy.wait('@getTasksRequest');
    cy.contains('h2', 'Nueva tarea').should('not.exist');

    // Verificar en lista de pendientes sin fecha
    cy.contains('mat-expansion-panel', 'Pendientes sin fecha')
      .should('be.visible')
      .within(() => {
        cy.get('task-item')
          .should('have.length', 1)
          .and('contain', 'Mi nueva tarea simple');
      });
  });

  it('debe permitir crear una tarea completa con fecha y verificar que aparece en Próximas tareas', () => {
    cy.url().should('include', '/tasks/list');
    cy.wait('@getTasksRequest');
    cy.get('task-item').should('not.exist');

    // Abrir el diálogo de nueva tarea
    cy.get('button[aria-label="Añadir tarea"]').should('be.visible').click();

    // Introducir título
    cy.get('input[placeholder="Nueva tarea"]').should('be.visible').type('Tarea completa con fecha');

    // Hacer clic en "Más opciones" para navegar a la página completa de creación
    cy.contains('button', 'Más opciones').should('be.visible').click();

    // Verificar que navegó a la página de creación de tareas
    cy.url().should('include', '/tasks/add');

    // Completar el campo de descripción
    cy.get('textarea[placeholder="Más detalles"]').type('Esta es una tarea con todos los campos rellenos');

    // Seleccionar prioridad Alta
    cy.contains('mat-form-field', 'Prioridad').find('mat-select').click();
    cy.get('mat-option[value="HIGH"]').click();

    // Rellenar la fecha determinada (por ejemplo, 01/06/2026)
    cy.get('input[placeholder="dd/mm/aaaa"]').type('08/01/2026');

    // Enviar el formulario haciendo clic en "Crear Tarea"
    cy.contains('button', 'Crear Tarea').should('not.be.disabled').click();

    // Esperar la petición de creación
    cy.wait('@createTaskRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        title: 'Tarea completa con fecha',
        description: 'Esta es una tarea con todos los campos rellenos',
        priority: 'HIGH',
        startDate: '2026-08-01',
        endDate: null,
        startTime: null,
        rrule: null,
      });
    });

    // Esperar la petición de detalles de la tarea al redirigir automáticamente
    cy.wait('@getSingleTaskRequest');
    cy.url().should('include', '/tasks/task-456');

    // Volver a la lista de tareas para verificar su correcta ubicación
    cy.visit('/tasks', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('accessToken', 'mock-access-token');
      },
    });

    // Esperar la recarga de las tareas
    cy.wait('@getTasksRequest');

    // Verificar que la tarea aparece exactamente en el panel de "Próximas tareas"
    cy.contains('mat-expansion-panel', 'Próximas tareas')
      .should('be.visible')
      .within(() => {
        cy.get('task-item')
          .should('have.length', 1)
          .and('contain', 'Tarea completa con fecha');
      });
  });
});
