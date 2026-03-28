import { MediaMatcher } from '@angular/cdk/layout';
import { Component, computed, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import {
  MatActionList,
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemIcon,
  MatListItemLine,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { SideMenuService } from './shared/services/side-menu-service';
import { AuthService } from './auth/services/auth-service';
import { MatIcon } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface MenuOpenValues {
  menuOpen: boolean;
  bigScreen: boolean;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatList,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatNavList,
    MatIcon,
    MatListItemIcon,
    MatActionList
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  sideMenuService = inject(SideMenuService);
  #authService = inject(AuthService);
  #media = inject(MediaMatcher);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);

  isBigScreen = signal(false);
  sideMenuOpen = linkedSignal<MenuOpenValues, boolean>({
    source: () => ({ menuOpen: this.sideMenuService.open(), bigScreen: this.isBigScreen() }),
    computation: ({ menuOpen, bigScreen }, previous) => {
      console.log(previous?.source, { menuOpen, bigScreen });
      if (!previous?.source.bigScreen && bigScreen) {
        return true;
      } else if (previous?.source.bigScreen && !bigScreen) {
        return false;
      } else {
        return bigScreen ? true : menuOpen;
      }
    },
  });

  logged = this.#authService.logged;
  user = computed(() =>
    this.#authService.loggedUserResource.hasValue()
      ? this.#authService.loggedUserResource.value().user
      : null,
  );

  // TODO: Implementar anytouch para eventos táctiles

  constructor() {
    const bigScreenQuery = this.#media.matchMedia('(min-width: 1280px)');
    this.isBigScreen.set(bigScreenQuery.matches);
    const bigScreenQueryListener = () => this.isBigScreen.set(bigScreenQuery.matches);
    bigScreenQuery.addEventListener('change', bigScreenQueryListener);
    this.#destroyRef.onDestroy(() =>
      bigScreenQuery.removeEventListener('change', bigScreenQueryListener),
    );
  }

  logout() {
    this.#authService.logout().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.#router.navigate(['/auth', 'login'])
    })
  }
}
