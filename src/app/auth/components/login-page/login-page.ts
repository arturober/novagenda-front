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
import { Router, RouterLink } from '@angular/router';
import { GoogleLogin } from '../../google-login/google-login';
import { AuthService } from '../../services/auth-service';

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
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);

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
            .login(this.loginModel())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
              next: () => this.#router.navigate(['/tasks']),
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

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    this.#authService
      .loginGoogle(resp.credential)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#router.navigate(['/tasks']),
        error: (err) => {
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          });
        },
      });
  }
}
