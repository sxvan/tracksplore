import { Component } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {
  constructor() {
    
  }

  message: string = '';
  action: string | undefined = undefined;
  show: boolean = false;


  open(message: string, action: string | undefined = undefined, duration: number | undefined = undefined) {
    this.message = message;
    this.action = action;
    this.show = true;

    if (duration) {
      console.log(duration);
      setTimeout(() => this.close(), duration);
    }
  }

  close() {
    this.show = false;
  }
}
