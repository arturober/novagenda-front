import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SideMenuService } from '../../services/side-menu-service';
import { Router } from '@angular/router';

@Component({
  selector: 'top-bar',
  imports: [MatToolbar, MatIcon, MatIconButton],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
  host: {
    class: 'page-header sticky top-0 left-0 z-20 transition-[translate]',
  },
})
export class TopBar {
  showMenuButton = input(true);
  title = input('');
  backUrl = input<string | null>(null);

  readonly #sideMenuService = inject(SideMenuService);
  readonly #router = inject(Router);

  openMenu() {
    this.#sideMenuService.open.set(true);
  }

  goBack() {
    if(this.backUrl()) {
      this.#router.navigateByUrl(this.backUrl()!);
    }
  }
}
