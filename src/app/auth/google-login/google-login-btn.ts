import { Directive, output } from '@angular/core';
import { GoogleSignIn, SignInResult } from '@capawesome/capacitor-google-sign-in';

@Directive({
  selector: '[googleLoginBtn]',
  host: {
    '(click)': 'sigIn()'
  }
})
export class GoogleLoginBtn {
  success = output<SignInResult>();
  failure = output<Error>();

  async sigIn() {
    try {
      this.success.emit(await GoogleSignIn.signIn());
    } catch(error) {
      this.failure.emit(error as Error);
    }
  }
}
