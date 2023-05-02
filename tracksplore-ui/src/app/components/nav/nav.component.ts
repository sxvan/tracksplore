import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user-model';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  constructor(public userService: UserService, public authenticationService: AuthenticationService, private router: Router) {
    this.userService.get().subscribe((userModel) => this.currentUser = userModel);
  }

  public currentUser: UserModel | undefined;
  
  clientId = 'f960e70adc2e4d18b35940d638f171a4';
  redirectUri = 'http://localhost:4200/callback';

  spotifyLogin(): void {
    document.location.href = 'https://accounts.spotify.com/authorize?client_id=' + this.clientId 
      + '&response_type=code&redirect_uri=' + this.redirectUri 
      + '&scope=user-top-read,user-library-read,playlist-read-private,user-read-email,user-read-private,user-modify-playback-state,streaming,user-read-playback-state&show_dialog=true';
  }

  signOut(): void {
    this.authenticationService.signOut();
  }

  navigate(url: string) {
    this.router.navigateByUrl(url)
  }
}
 