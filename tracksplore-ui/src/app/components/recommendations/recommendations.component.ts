import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { connectSpotify } from 'src/app/models/spotify-web-playback-sdk';
import { SpotifyUserService } from 'src/app/services/spotify-user.service';
import { Player } from 'src/app/models/player';
import { SpotifyPlayerService } from 'src/app/services/spotify-player.service';
import { SpotifyTrack } from 'src/app/models/spotify-track';
import { MusicTasteService } from 'src/app/services/music-taste.service';
import { lastValueFrom, tap } from 'rxjs';
import { MusicTasteModel } from 'src/app/models/music-taste-model';
import { SpotifyTokenService } from 'src/app/services/spotify-token.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {
  public tracks: SpotifyTrack[] = []
  public currentTrack?: SpotifyTrack = undefined;
  public musicTastes: MusicTasteModel[] = [];
  private deviceId?: string = undefined;

  constructor(private spotifyService: SpotifyService, private spotifyTokenService: SpotifyTokenService, private spotifyPlayerService: SpotifyPlayerService, private musicTasteService: MusicTasteService) {
  }

  async ngOnInit(): Promise<void> {
    
    this.spotifyTokenService.token$.pipe(
      tap((token) => {
        connectSpotify(token?.access_token, (player: Player, deviceId: string) => {
          this.deviceId = deviceId;
        });
      })
    );
    

    this.musicTastes = (await lastValueFrom(this.musicTasteService.get())).filter(mt => !mt.isDisabled);
    for (let musicTaste of this.musicTastes) {
      this.tracks = this.tracks.concat(await this.spotifyService.getRecommendations(musicTaste, 5))
    }
    console.log(this.musicTastes);
  }

  async play(track: SpotifyTrack) {
    await this.spotifyPlayerService.playTrack(track, this.deviceId)
  }
}
