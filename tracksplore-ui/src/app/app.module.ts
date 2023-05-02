import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { SpotifyCallbackComponent } from './components/spotify-callback/spotify-callback.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user-service';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { AuthenticationService } from './services/authentication-service';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { LinkSpotifyComponent } from './components/link-spotify/link-spotify.component';
import { LinkSpotifyCallbackComponent } from './components/link-spotify-callback/link-spotify-callback.component';
import { MusicTasteComponent } from './components/music-taste/music-taste.component';
import { SpotifyService } from './services/spotify-service';
import { SpotifyUserService } from './services/spotify-user-service';
import { SpotifyArtistGroupService } from './services/spotify-artist-group-service';
import { SpotifyGenreService } from './services/spotify-genre-service';
import { MusicTasteService } from './services/music-taste-service';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { SpotifyPlayerService } from './services/spotify-player-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    SpotifyCallbackComponent,
    SignUpComponent,
    SignInComponent,
    SnackbarComponent,
    LinkSpotifyComponent,
    LinkSpotifyCallbackComponent,
    MusicTasteComponent,
    RecommendationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
    UserService,
    AuthenticationService,
    MusicTasteService,
    SpotifyService,
    SpotifyUserService,
    SpotifyArtistGroupService,
    SpotifyGenreService,
    SpotifyPlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
