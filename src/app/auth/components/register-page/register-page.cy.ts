/// <reference types="cypress" />
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideGoogleId } from '../../google-login/google-login.config';
import { AuthService } from '../../services/auth-service';
import { RegisterPage } from './register-page';

describe('RegisterPage Component Test', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Error retrieving icon')) {
        return false;
      }
      return true;
    });

    const registerStub = cy.stub().as('register').returns(of(undefined));
    const snackBarStub = cy.stub().as('snackBarOpen');

    cy.mount(RegisterPage, {
      providers: [
        provideRouter([]),
        provideGoogleId('dummy-google-client-id'),
        {
          provide: AuthService,
          useValue: {
            register: registerStub,
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarStub,
          },
        },
      ],
    }).then(() => {
      const router = TestBed.inject(Router);
      cy.stub(router, 'navigate').as('navigate');
    });
  });

  it('should have submit button disabled initially', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should validate invalid email and show error', () => {
    cy.get('input[placeholder="email@email.com"]').type('invalid-email').blur();
    cy.get('mat-error').should('contain', 'El correo no tiene un formato correcto');
  });

  it('should validate short password', () => {
    cy.get('input[placeholder="*******"]').first().type('12345').blur();
    cy.get('mat-error').should('contain', 'Debe tener al menos 8 caracteres');
  });

  it('should validate passwords match', () => {
    cy.get('input[placeholder="Marta Martínez"]').type('Marta');
    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').first().type('Password123');
    cy.get('input[placeholder="*******"]').last().type('Password456').blur();
    cy.get('mat-error').should('contain', 'Las contraseñas no coinciden');
  });

  it('should submit successfully with valid input', () => {
    cy.get('input[placeholder="Marta Martínez"]').type('Marta Martínez');
    cy.get('input[placeholder="email@email.com"]').type('marta@example.com');
    cy.get('input[placeholder="*******"]').first().type('Password123');
    cy.get('input[placeholder="*******"]').last().type('Password123');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.get('@register').should('have.been.calledWith', {
      name: 'Marta Martínez',
      email: 'marta@example.com',
      password: 'Password123',
    });

    cy.get('@navigate').should('have.been.calledWith', ['/auth', 'login']);
    cy.get('@snackBarOpen').should('have.been.calledWith', 'Usuario registrado correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: 'success',
    });
  });
});
