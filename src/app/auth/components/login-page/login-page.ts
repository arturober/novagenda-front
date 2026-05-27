import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { GoogleLoginBtn } from '../../google-login/google-login-btn';
import { AuthService } from '../../services/auth-service';
import { Capacitor } from '@capacitor/core';
import { GoogleLogin } from '../../google-login/google-login';
import { SignInResult } from '@capawesome/capacitor-google-sign-in';
import { PushNotifications, Token } from '@capacitor/push-notifications';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'login-page',
  imports: [
    FormRoot,
    FormField,
    MatInput,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatLabel,
    MatError,
    MatIcon,
    MatSuffix,
    MatIconButton,
    MatPrefix,
    MatAnchor,
    MatButton,
    RouterLink,
    GoogleLoginBtn,
    GoogleLogin,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  host: {
    class: 'flex flex-col items-center justify-center min-h-screen w-screen',
  },
})
export class LoginPage {
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #snackBar = inject(MatSnackBar);

  firebaseToken?: string;

  loginModel = signal<LoginModel>({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (schema) => {
      required(schema.email, { message: 'Campo obligatorio' });
      required(schema.password, { message: 'Campo obligatorio' });
      email(schema.email, { message: 'El correo no tiene un formato correcto' });
    },
    {
      submission: {
        action: async () => {
          this.#authService
            .login(this.loginModel(), this.firebaseToken)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
              next: () => this.#authService.navigateAfterLogin(),
              error: (err) => {
                this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
                  duration: 3000,
                  panelClass: 'error',
                });
              },
            });
        },
      },
    },
  );

  showPass = signal(false);
  native = Capacitor.isNativePlatform();

  constructor() {
    if (Capacitor.getPlatform() === 'android') {
      PushNotifications.register();

      // On success, we should be able to receive notifications
      const registrationListener = PushNotifications.addListener('registration', (token: Token) => {
        this.firebaseToken = token.value;
      });

      this.#destroyRef.onDestroy(() => registrationListener.then((r) => r.remove()));
    }
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse | SignInResult) {
    let token;
    if (Object.hasOwn(resp, 'credential')) {
      token = (resp as google.accounts.id.CredentialResponse).credential;
    } else {
      token = (resp as SignInResult).idToken;
    }

    this.#authService
      .loginGoogle(token, this.firebaseToken)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#authService.navigateAfterLogin(),
        error: (err) => {
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          });
        },
      });
  }
}
