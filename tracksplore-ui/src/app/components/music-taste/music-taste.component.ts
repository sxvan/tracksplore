import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AddGenreFeatureModel } from 'src/app/models/add-genre-feature-model';
import { AddMusicTasteModel } from 'src/app/models/add-music-taste-model';
import { MusicTasteModel } from 'src/app/models/music-taste-model';
import { SpotifyArtist } from 'src/app/models/spotify-artist';
import { SpotifyArtistGroup } from 'src/app/models/spotify-artist-group';
import { SpotifyGenre } from 'src/app/models/spotify-genre';
import { MusicTasteService } from 'src/app/services/music-taste-service';
import { SpotifyArtistGroupService } from 'src/app/services/spotify-artist-group-service';
import { SpotifyService } from 'src/app/services/spotify-service';

@Component({
  selector: 'app-music-taste',
  templateUrl: './music-taste.component.html',
  styleUrls: ['./music-taste.component.css']
})
export class MusicTasteComponent implements OnInit {
  public artistGroups: SpotifyArtistGroup[] = [];

  constructor(private spotifyService: SpotifyService, private spotifyArtistGroupService: SpotifyArtistGroupService, private musicTasteService: MusicTasteService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    const musicTastes = await lastValueFrom(this.musicTasteService.get());
    if (musicTastes && musicTastes.length > 0) {
      this.artistGroups = await this.spotifyArtistGroupService.getArtistGroupsFromMusicTastes(musicTastes);
    } else {
      this.formArtistGroups();
    }
  }

  toggleRemoveArtistGroup(artistGroup: SpotifyArtistGroup) {
    artistGroup.isDisabled = !artistGroup.isDisabled;
  }

  async saveSelection() {
    const promises: Promise<MusicTasteModel>[] = []
    for (let artistGroup of this.artistGroups) {
      const artistIds = artistGroup.artists.flatMap(a => a.id);
      const genreFeatures = artistGroup.relatedGenres.map(rg => new AddGenreFeatureModel(rg.name, rg.percentage))
      const model = new AddMusicTasteModel(artistIds, artistGroup.isDisabled, genreFeatures);

      promises.push(lastValueFrom(this.musicTasteService.add(model)))
    }

    await Promise.all(promises);

    this.router.navigate(['recommendations']);
  }

  private async formArtistGroups() {
    const artistsPromise = this.spotifyService.getTopArtists(50);
    const [playlistTracks, savedTracks, topTracks] = await Promise.all([this.spotifyService.getAllPlaylistTracks(), this.spotifyService.getSavedTracks(), this.spotifyService.getTopTracks(50)]);
    const tracks = playlistTracks.concat(savedTracks).concat(topTracks); // remove multiple entries?

    const artists = await artistsPromise;
    await this.spotifyArtistGroupService.setRelatedGenres(artists, tracks);

    for (let artist of artists) {
      artist.relatedGenres = artist.relatedGenres.filter(rg => rg.percentage > 10);
    }

    this.artistGroups = this.spotifyArtistGroupService.getArtistGroups(artists, 60).sort((a, b) => a.artists.length < b.artists.length ? 1 : -1) // why sort it here? sorting shouldnt change algorithm
    this.artistGroups = this.spotifyArtistGroupService.tryRemoveSingleArtistGroups(this.artistGroups, 30);
    this.artistGroups.forEach(ag => { 
      ag.relatedGenres.sort((a, b) => a.percentage < b.percentage ? 1 : -1); // sorting = sus! only sort for frontend purposes
    });
  }
}
