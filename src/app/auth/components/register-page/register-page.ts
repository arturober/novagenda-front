import { Component, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatFormField, MatLabel, MatError, MatSuffix, MatPrefix } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { GoogleLogin } from '../../google-login/google-login';

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
    MatCheckbox,
    RouterLink,
    GoogleLogin
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  registerModel = signal<RegisterModel>({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  avatar = '';

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    console.log(resp.credential);
  }
}
