import { Component, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix, MatPrefix } from '@angular/material/input';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterLink } from "@angular/router";
import { GoogleLogin } from "../../google-login/google-login";

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
    MatCheckbox,
    RouterLink,
    GoogleLogin
],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  host: {
    class: 'flex flex-col items-center justify-center min-h-screen w-screen',
  },
})
export class LoginPage {
  loginModel = signal<LoginModel>({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (schema) => {
      required(schema.email, {message: "Campo obligatorio"});
      required(schema.password, {message: "Campo obligatorio"});
      email(schema.email, { message: "El correo no tiene un formato correcto"});
    },
    {
      submission: {
        action: async () => {
          console.log("ASDFASDF");
        },
      },
    },
  );

  showPass = signal(false);

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    console.log(resp.credential);
  }
}
