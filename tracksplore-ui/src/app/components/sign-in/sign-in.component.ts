import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateModel } from 'src/app/models/authenticate-model';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  signInForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  get email() { return this.signInForm.get('email') }
  get password() { return this.signInForm.get('password') }

  async onSubmit() {
    this.signInForm.markAllAsTouched();

    if (!this.signInForm.valid) {
      return;
    }

    const model = new AuthenticateModel(
      this.email?.getRawValue(), 
      this.password?.getRawValue()
      );

    await this.authenticationService.authenticate(model);
    this.router.navigate(['home']);
  }
}
