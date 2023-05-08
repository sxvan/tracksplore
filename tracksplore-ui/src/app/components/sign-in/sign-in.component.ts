import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, switchMap, tap } from 'rxjs';
import { CredentialsModel } from 'src/app/models/credentials-model';
import { SnackbarService } from 'src/app/modules/snackbar/services/snackbar.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private snackbarService: SnackbarService, private authenticationService: AuthenticationService, private router: Router) {
    
  }

  signInForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  get email() { return this.signInForm.get('email') as FormControl<string> }
  get password() { return this.signInForm.get('password') as FormControl<string> }

  onSubmit() {
    this.signInForm.markAllAsTouched();

    if (!this.signInForm.valid) {
      return;
    }

    const model: CredentialsModel = { 
      identifier: this.email?.getRawValue(),
      password: this.password?.getRawValue()
    }

    this.authenticationService.authenticate(model).pipe(
      tap((authModel) => this.snackbarService.open({ id: 1, content: 'Welcome back ' + authModel.user.displayName, action: 'Close', durationMs: 5000 })),
      switchMap(() => this.router.navigate(['music-taste'])),
      first(),
    ).subscribe();
  }
}
