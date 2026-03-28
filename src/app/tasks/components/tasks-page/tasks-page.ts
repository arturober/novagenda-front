import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { AdaptativeTabs } from '../../../shared/components/adaptative-tabs/adaptative-tabs';
import { SideMenuService } from '../../../shared/services/side-menu-service';
import { MatIconButton, MatFabButton } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tasks-page',
  imports: [MatToolbar, MatIcon, MatIconButton, AdaptativeTabs, MatFabButton, RouterOutlet],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage {
  #sideMenuService = inject(SideMenuService);

  openMenu() {
    this.#sideMenuService.open.set(true);
  }
}
