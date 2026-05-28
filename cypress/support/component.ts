/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="google.accounts" />
import '@angular/compiler';
import { mount } from 'cypress/angular-zoneless';

// Augment the Cypress namespace to include the mount command
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
