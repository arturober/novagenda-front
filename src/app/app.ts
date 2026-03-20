import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [MatDrawer, MatDrawerContainer, MatDrawerContent, MatToolbar, MatIconButton, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  sideMenuOpen = signal(false);
}
