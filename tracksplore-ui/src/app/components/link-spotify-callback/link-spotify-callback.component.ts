import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessToken } from 'src/app/models/access-token';
import { SpotifyUserService } from 'src/app/services/spotify-user-service';

@Component({
  selector: 'app-link-spotify-callback',
  templateUrl: './link-spotify-callback.component.html',
  styleUrls: ['./link-spotify-callback.component.css']
})
export class LinkSpotifyCallbackComponent {
  
  constructor(private spotifyUserService: SpotifyUserService, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  
  ngOnInit(): void {
    console.log('test');
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const url = 'https://accounts.spotify.com/api/token';
      const authorization = 'Basic ' + btoa("f960e70adc2e4d18b35940d638f171a4:470b3992d0df4564962ddef751399804")
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authorization
      });
      const body = 'grant_type=authorization_code&redirect_uri=http://localhost:4200/link-spotify-callback&code=' + code;
      this.http.post<AccessToken>(url, body, { headers: headers }).subscribe(
        response => {
          this.spotifyUserService.setAccessToken(response);
        });
      this.router.navigate(['sign-up']);
    })
  }

}
