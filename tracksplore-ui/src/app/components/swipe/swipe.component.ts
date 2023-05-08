import { Component, OnInit } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
import { MusicTasteModel } from 'src/app/models/music-taste-model';
import { Player } from 'src/app/models/player';
import { connectSpotify } from 'src/app/models/spotify-web-playback-sdk';
import { SpotifyDevice } from 'src/app/models/spotify-device';
import { SpotifyTrack } from 'src/app/models/spotify-track';
import { MusicTasteService } from 'src/app/services/music-taste.service';
import { SpotifyPlayerService } from 'src/app/services/spotify-player.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { SpotifyUserService } from 'src/app/services/spotify-user.service';
import { SpotifyTokenService } from 'src/app/services/spotify-token.service';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})
export class SwipeComponent implements OnInit {
  public tracks: SpotifyTrack[] = []
  public currentTrackIndex = 0;
  public musicTastes: MusicTasteModel[] = [];
  public currentMusicTasteIndex: number = 7;
  public deviceIndex = 0;
  private deviceId?: string = undefined;
  public devices: SpotifyDevice[] = [];

  
  get currentTrack() { return this.tracks[this.currentTrackIndex] }
  get currentMusicTaste() { return this.musicTastes[this.currentMusicTasteIndex] }
  get currentImage() { return this.currentTrack.album.images[0].url }

  get artists() {
    let artists = '';
    for (let i = 0; i < this.currentTrack.artists.length; i++) {
      artists += this.currentTrack.artists[i].name;
      if (i != this.currentTrack.artists.length - 1) {
        artists += ', ';
      }
    }

    return artists;
  }

  constructor(
    private spotifyService: SpotifyService,
    private spotifyTokenService: SpotifyTokenService,
    private spotifyPlayerService: SpotifyPlayerService,
    private musicTasteService: MusicTasteService) {
    
  }

  async ngOnInit(): Promise<void> {

   this.spotifyTokenService.token$.pipe(
      tap((token) => {
        connectSpotify(token?.access_token, (player: Player, deviceId: string) => {
          this.deviceId = deviceId;
        });
      })
    );

    this.devices = await this.spotifyPlayerService.getAvailableDevices();
    console.log(this.devices);

    this.musicTastes = (await lastValueFrom(this.musicTasteService.get())).filter(mt => !mt.isDisabled);
    this.tracks = await this.spotifyService.getRecommendations(this.currentMusicTaste, 5);
    await this.playTrack();
  }

  async playTrack() {
    await this.spotifyPlayerService.playTrack(this.currentTrack, this.deviceId)
  }

  async next() {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      this.currentTrackIndex++;
    } else if (this.currentMusicTasteIndex < this.musicTastes.length - 1){
      this.currentMusicTasteIndex++;
      this.tracks = await this.spotifyService.getRecommendations(this.currentMusicTaste, 5);
      this.currentTrackIndex = 0;
    } else {

    }

    this.deviceId = this.devices[0].id;
    await this.playTrack();
  }
}
