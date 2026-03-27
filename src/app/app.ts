import { Component, signal } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, MatDrawer, MatDrawerContainer, MatDrawerContent ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  sideMenuOpen = signal(false);
}
