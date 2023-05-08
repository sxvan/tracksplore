import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyToken } from 'src/app/models/spotify-token';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.css']
})
export class SpotifyCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const url = 'https://accounts.spotify.com/api/token';
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Zjk2MGU3MGFkYzJlNGQxOGIzNTk0MGQ2MzhmMTcxYTQ6NDcwYjM5OTJkMGRmNDU2NDk2MmRkZWY3NTEzOTk4MDQ='
      });
      const body = 'grant_type=authorization_code&redirect_uri=http://localhost:4200/callback&code=' + code;
      this.http.post<SpotifyToken>(url, body, { headers: headers }).subscribe(
        response => {
          console.log(response.access_token);
        });
    })
  }
}
