import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, lastValueFrom, switchMap, tap } from 'rxjs';
import { SpotifyTokenService } from 'src/app/services/spotify-token.service';

@Component({
  selector: 'app-link-spotify-callback',
  templateUrl: './link-spotify-callback.component.html',
  styleUrls: ['./link-spotify-callback.component.css']
})
export class LinkSpotifyCallbackComponent {

  constructor(private spotifyTokenService: SpotifyTokenService, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      this.spotifyTokenService.authenticate(code).pipe(
        switchMap(() => this.router.navigate(['sign-up'])),
        first()
      ).subscribe()
    });
  }
}
