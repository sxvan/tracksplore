import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SpotifyCallbackComponent } from './components/spotify-callback/spotify-callback.component';
import { LinkSpotifyComponent } from './components/link-spotify/link-spotify.component';
import { LinkSpotifyCallbackComponent } from './components/link-spotify-callback/link-spotify-callback.component';
import { MusicTasteComponent } from './components/music-taste/music-taste.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { SwipeComponent } from './components/swipe/swipe.component';

const routes: Routes = [ 
  { path: 'home', component: HomeComponent },
  { path: 'callback', component: SpotifyCallbackComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'link-spotify', component: LinkSpotifyComponent },
  { path: 'link-spotify-callback', component: LinkSpotifyCallbackComponent },
  { path: 'music-taste', component: MusicTasteComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: 'swipe', component: SwipeComponent }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
