import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user-model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  user$: Observable<UserModel | undefined> = this.authenticationService.user$;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    
  }

  signOut(): void {
    this.authenticationService.signOut();
  }

  navigate(url: string) {
    this.router.navigate([url])
  }
}
 