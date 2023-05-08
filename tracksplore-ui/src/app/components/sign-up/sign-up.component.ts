import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, ReplaySubject, first, of, switchMap, take, tap } from 'rxjs';
import { AddUserModel } from 'src/app/models/add-user-model';
import { UserService } from 'src/app/services/user.service';
import { SpotifyUserService } from 'src/app/services/spotify-user.service';
import { SpotifyAccount } from 'src/app/models/spotify-account';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/modules/snackbar/services/snackbar.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {  
  public account$: Observable<SpotifyAccount | undefined> = this.spotifyUserService.account$;

  constructor(private snackbarService: SnackbarService, private userService: UserService, private spotifyUserService: SpotifyUserService, private router: Router) {
    
  }

  async ngOnInit(): Promise<void> {    
  }

  signUpForm = new FormGroup({
    displayName: new FormControl<string>('', [Validators.required, Validators.maxLength(50), Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.maxLength(300), Validators.email]),
    birthdate: new FormControl<Date | undefined>(undefined, [Validators.required, this.maxDateValidator(new Date())]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator('password')]),
    gender: new FormControl(-1, [Validators.min(1)])
  });

  get displayName() { return this.signUpForm.controls.displayName as FormControl<string> }
  get email() { return this.signUpForm.controls.email as FormControl<string> }
  get birthdate() { return this.signUpForm.controls.birthdate as FormControl<Date> }
  get password() { return this.signUpForm.controls.password as FormControl<string> }
  get confirmPassword() { return this.signUpForm.controls.confirmPassword as FormControl<string> }
  get gender() { return this.signUpForm.controls.gender as FormControl<number> }

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

     this.account$.pipe(
      switchMap((account): Observable<AddUserModel> => of({
        displayName: this.displayName.getRawValue(),
        email: this.email.getRawValue(),
        password: this.password.getRawValue(),
        birthdate: this.birthdate.getRawValue(),
        gender: +this.gender.getRawValue(),
        spotifyId: account?.id
      })),
      tap((addUserModel) => {
        this.userService.add(addUserModel).pipe(
          tap((usermodel) => {
            this.snackbarService.open({ id: 1, content: 'Successfully created your account. ' + usermodel.displayName, action: 'Close', type: 'success' });
          }),
          first()
        ).subscribe();
      }),
      switchMap(() => this.router.navigate(['sign-in'])),
      first(),
    ).subscribe();  
  }

  redirectToSpotifyAuthorization() {
    this.spotifyUserService.redirectToSpotifyAuthorization();
  }
}
