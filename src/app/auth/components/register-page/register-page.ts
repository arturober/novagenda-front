import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface RegisterModel {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

@Component({
  selector: 'register-page',
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
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
  host: {
    class: 'flex flex-col items-center justify-center min-h-screen w-screen',
  },
})
export class RegisterPage {
  #authService = inject(AuthService);
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);
  #destroyRef = inject(DestroyRef);

  registerModel = signal<RegisterModel>({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  avatar = '';

  registerForm = form(
    this.registerModel,
    (schema) => {
      required(schema.name, { message: 'Campo obligatorio' });
      required(schema.email, { message: 'Campo obligatorio' });
      required(schema.password, { message: 'Campo obligatorio' });
      email(schema.email, { message: 'El correo no tiene un formato correcto' });
      minLength(schema.password, 8, {
        message: 'Debe tener al menos 8 caracteres',
      });
      // applyWhenValue(
      //   schema,
      //   (schema) => schema.password.length >= 8,
      //   (schema) => {
      //     pattern(schema.password, /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/, {
      //       message:
      //         'Debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial',
      //     });
      //   },
      // );

      validate(schema.repeatPassword, ({ value, valueOf }) => {
        const pass = valueOf(schema.password);
        if (value() !== pass) {
          return {
            kind: 'sameValue',
            message: 'Las contraseñas no coinciden',
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async () => {
          this.#authService
            .register({
              name: this.registerModel().name,
              email: this.registerModel().email,
              password: this.registerModel().password,
            })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
              next: () => {
                this.#router.navigate(['/auth', 'login']);
                this.#snackBar.open('Usuario registrado correctamente', 'Cerrar', {
                  duration: 3000,
                  panelClass: 'success',
                });
              },
              error: (err) => {
                this.#snackBar.open(err.error.message, 'Cerrar', {
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
  showPass2 = signal(false);

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
        this.#authService
      .loginGoogle(resp.credential)
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
