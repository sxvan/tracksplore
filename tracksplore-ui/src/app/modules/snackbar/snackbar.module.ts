import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from './services/snackbar.service';
import { SnackbarComponent } from './components/snackbar/snackbar.component';



@NgModule({
  declarations: [
    SnackbarComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    SnackbarService
  ],
  exports: [
    SnackbarComponent
  ]
})
export class SnackbarModule { }
