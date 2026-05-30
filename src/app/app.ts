import { MediaMatcher } from '@angular/cdk/layout';
import { Component, computed, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemAvatar,
  MatListItemIcon,
  MatListItemLine,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { NavigationBar, NavigationBarColor } from '@capgo/capacitor-navigation-bar';
import { AuthService } from './auth/services/auth-service';
import { SideMenuService } from './shared/services/side-menu-service';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';

interface MenuOpenValues {
  menuOpen: boolean;
  bigScreen: boolean;
}

interface MenuLink {
  icon: string;
  url: string;
  title: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatNavList,
    MatIcon,
    MatListItemIcon,
    MatActionList,
    MatBadge,
    RouterLink,
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
  invitations = computed(() =>
    this.#authService.loggedUserResource.hasValue()
      ? this.#authService.loggedUserResource.value().pendingInvitations
      : 0,
  );

  currentUrl = computed(() => this.#router.lastSuccessfulNavigation()?.finalUrl?.toString() ?? '');

  links: MenuLink[] = [
    { icon: 'checklist', title: 'Mis tareas', url: '/tasks' },
    { icon: 'add-task', title: 'Nueva tarea', url: '/tasks/add' },
    { icon: 'category', title: 'Categorías', url: '/categories' },
  ];

  // TODO: Implementar anytouch para eventos táctiles

  constructor() {
    if (Capacitor.isNativePlatform()) {
      this.initializeNative();
    }

    const bigScreenQuery = this.#media.matchMedia('(min-width: 1280px)');
    this.isBigScreen.set(bigScreenQuery.matches);
    const bigScreenQueryListener = () => this.isBigScreen.set(bigScreenQuery.matches);
    bigScreenQuery.addEventListener('change', bigScreenQueryListener);
    this.#destroyRef.onDestroy(() =>
      bigScreenQuery.removeEventListener('change', bigScreenQueryListener),
    );
  }

  async initializeNative() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    await NavigationBar.setNavigationBarColor({
      color: NavigationBarColor.TRANSPARENT,
      darkButtons: prefersDark.matches,
    });

    await SystemBars.setStyle({
      style: prefersDark.matches ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
    });

    prefersDark.addEventListener('change', (mediaQuery) => {
      NavigationBar.setNavigationBarColor({
        color: NavigationBarColor.TRANSPARENT,
        darkButtons: mediaQuery.matches,
      });
      SystemBars.setStyle({
        style: mediaQuery.matches ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
      });
    });

    SplashScreen.hide();

    await GoogleSignIn.initialize({
      clientId: '940474514077-20namm6ra4h93elaaun08nvarq07i3hh.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });

    const res = await PushNotifications.checkPermissions();
    if (res.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        if (notification.notification.data.taskId) {
          this.#router.navigate(['/tasks', notification.notification.data.taskId, 'comments']);
        }
      }
    );
  }

  logout() {
    this.#authService
      .logout()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#router.navigate(['/auth', 'login']);
      });
  }
}
