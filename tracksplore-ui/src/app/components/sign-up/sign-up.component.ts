import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, catchError } from 'rxjs';
import { AddUserModel } from 'src/app/models/add-user-model';
import { UserService } from 'src/app/services/user-service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { SpotifyUserService } from 'src/app/services/spotify-user-service';
import { SpotifyAccount } from 'src/app/models/spotify-account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {  
  
  @ViewChild(SnackbarComponent)
  private snackbar!: SnackbarComponent;
  private clientId = 'f960e70adc2e4d18b35940d638f171a4';
  private redirectUri = 'http://localhost:4200/link-spotify-callback';
  private spotifyAccountObject: SpotifyAccount | undefined;

  constructor(private userService: UserService, private spotifyUserService: SpotifyUserService, private router: Router) {
    
  }

  async ngOnInit(): Promise<void> {
    this.spotifyAccount?.disable();
    this.spotifyAccountObject = await this.spotifyUserService.getSpotifyAccount();
    if (this.spotifyAccountObject) {
      this.spotifyAccount?.setValue(this.spotifyAccountObject.display_name); 
    }
  }

  signUpForm = new FormGroup({
    spotifyAccount: new FormControl(''),
    displayName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.maxLength(300), Validators.email]),
    birthdate: new FormControl('', [Validators.required, this.maxDateValidator(new Date())]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator('password')]),
    gender: new FormControl(-1, [Validators.min(1)])
  });

  get spotifyAccount() { return this.signUpForm.get('spotifyAccount') }
  get displayName() { return this.signUpForm.get('displayName') }
  get email() { return this.signUpForm.get('email') }
  get birthdate() { return this.signUpForm.get('birthdate') }
  get password() { return this.signUpForm.get('password') }
  get confirmPassword() { return this.signUpForm.get('confirmPassword') }
  get gender() { return this.signUpForm.get('gender') }

  maxDateValidator(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return new Date(control.value) > maxDate ? { max: true } : null
    }
  }

  passwordMatchValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value != control.root.get(otherControlName)?.value ? { passwordMismatch: true } : null
    }
  }

  onSubmit() {
    this.signUpForm.markAllAsTouched();

    if (!this.signUpForm.valid) {
      return;
    }

    const model = new AddUserModel(
      this.displayName?.getRawValue(),
      this.email?.getRawValue(),
      this.password?.getRawValue(),
      this.birthdate?.getRawValue(),
      +this.gender?.getRawValue(),
      this.spotifyAccountObject?.id);

    this.userService.add(model).subscribe({ error: (err) => {
      this.snackbar.open('Error: ' + err.message, 'Close');
    }, complete: () => {
      this.snackbar.open('Successfully created your account.', 'Close', 4000);
    }});
  }

  navigateToSpotifyAuthorization() {
    document.location.href = 'https://accounts.spotify.com/authorize?client_id=' + this.clientId 
      + '&response_type=code&redirect_uri=' + this.redirectUri 
      + '&scope=user-top-read,user-library-read,playlist-read-private,user-read-email,user-read-private,user-modify-playback-state,streaming,user-read-playback-state&show_dialog=true';
  }


}
