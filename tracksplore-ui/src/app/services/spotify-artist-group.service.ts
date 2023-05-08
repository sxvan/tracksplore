import { Injectable } from "@angular/core";
import { GroupSimilarity } from "../models/group-similarity";
import { Similarity } from "../models/similarity";
import { SpotifyArtist } from "../models/spotify-artist";
import { SpotifyArtistGroup } from "../models/spotify-artist-group";
import { SpotifyGenre } from "../models/spotify-genre";
import { SpotifyTrack } from "../models/spotify-track";
import { SpotifyGenreService } from "./spotify-genre.service";
import { SpotifyService } from "./spotify.service";
import { MusicTasteModel } from "../models/music-taste-model";

@Injectable()
export class SpotifyArtistGroupService {

  constructor(private spotifyService: SpotifyService, private spotifyGenreService: SpotifyGenreService) { }

  public getArtistGroups(artists: SpotifyArtist[], minSimilarity: number): SpotifyArtistGroup[] {
    const similarityResults: Similarity[] = [];

    artists.forEach((a, i) => {
      artists.slice(i + 1).forEach(a2 => {
        similarityResults.push(new Similarity(
          a,
          a2,
          this.spotifyGenreService.getTwoWaySimilarity(a. relatedGenres, a2.relatedGenres)))
      });
    })

    similarityResults.sort((a, b) => a.similarity < b.similarity ? 1 : -1); 
    
    const artistGroups: SpotifyArtistGroup[] = [];

    const artist = similarityResults[0].source;
    const otherArtist = similarityResults[0].target;

    let currentArtistGroup = new SpotifyArtistGroup([artist, otherArtist], this.spotifyGenreService.getMergedGenres([artist, otherArtist].flatMap(a => a.relatedGenres), 2, 10))
    artistGroups.push(currentArtistGroup);
    
    let artistsToProcess = artists.filter(a => artistGroups.flatMap(ag => ag.artists).findIndex(x => x.id == a.id) === -1);

    while (artistsToProcess.length > 0) {
      
      let groupSimilarityResults = artistsToProcess.map(a => { 
        let similarity = 0;
        if (currentArtistGroup.artists.length > 1) {
          similarity = this.spotifyGenreService.getSimilarity(a.relatedGenres, currentArtistGroup.relatedGenres);
        } else {
          similarity = this.spotifyGenreService.getTwoWaySimilarity(a.relatedGenres, currentArtistGroup.relatedGenres);
        }

        return new GroupSimilarity(currentArtistGroup, a, similarity);
      });
      let highestGroupSimilarityResult = groupSimilarityResults.sort((a, b) => a.similarity < b.similarity ? 1 : -1)[0];

      if (highestGroupSimilarityResult.similarity >= minSimilarity) {
        currentArtistGroup.artists.push(highestGroupSimilarityResult.artist);
        currentArtistGroup.relatedGenres = this.spotifyGenreService.getMergedGenres(currentArtistGroup.artists.flatMap(a => a.relatedGenres), currentArtistGroup.artists.length, 10);
      } else {
        currentArtistGroup = new SpotifyArtistGroup([highestGroupSimilarityResult.artist], highestGroupSimilarityResult.artist.relatedGenres);
        artistGroups.push(currentArtistGroup);
      }
      
      artistsToProcess = artistsToProcess.filter(a => artistGroups.flatMap(ag => ag.artists).findIndex(x => x.id == a.id) === -1);
    }

    return artistGroups;
  }


  public tryRemoveSingleArtistGroups(artistGroups: SpotifyArtistGroup[], minSimilarity: number) {
    let newArtistGroups: SpotifyArtistGroup[] = artistGroups.filter(ag => ag.artists.length > 1);

    for (let singleArtistGroup of artistGroups.filter(ag => ag.artists.length < 2)) {
      let groupSimilarities: GroupSimilarity[] = [];
      artistGroups.forEach(ag => {
        if (ag.artists[0].id !== singleArtistGroup.artists[0].id) {
          let similarity: number;
          if (ag.artists.length > 1) {
            similarity = this.spotifyGenreService.getSimilarity(ag.relatedGenres, singleArtistGroup.relatedGenres);
          } else {
            similarity = this.spotifyGenreService.getTwoWaySimilarity(singleArtistGroup.relatedGenres, ag.relatedGenres);
          }

          groupSimilarities.push(new GroupSimilarity(ag, singleArtistGroup.artists[0], similarity));
        }
      });

      let highestGroupSimilarity = groupSimilarities.sort((a, b) => a.similarity < b.similarity ? 1 : -1)[0];
      if (highestGroupSimilarity.similarity >= minSimilarity) {
        highestGroupSimilarity.artistGroup.artists.push(singleArtistGroup.artists[0]);
        highestGroupSimilarity.artistGroup.relatedGenres = this.spotifyGenreService.getMergedGenres(
          highestGroupSimilarity.artistGroup.artists.flatMap(a => a.relatedGenres),
          highestGroupSimilarity.artistGroup.artists.length,
          10);
      } else {
        newArtistGroups.push(singleArtistGroup);
      }
    }

    return newArtistGroups;
  }

  public async setRelatedGenres(artists: SpotifyArtist[], tracks: SpotifyTrack[]): Promise<void> {
    for (let artist of artists) {

      artist.trackCount = tracks.filter(t => !!t.artists.find(a => a.id === artist.id)).length; // weird spot to set this. is this even necessary?
      artist.relatedGenres = [];
      artist.relatedArtists = (await this.spotifyService.getRelatedArtists(artist.id)).concat(artist);

      artist.relatedArtists.flatMap(ra => ra.genres).forEach(g => {
          let relatedGenre = artist.relatedGenres.find(rl => rl.name == g);
          if (relatedGenre) {
            relatedGenre.count++;
          } else {
            relatedGenre = new SpotifyGenre(g, 1, 0);
            artist.relatedGenres.push(relatedGenre);
          }
      });

      artist.relatedGenres.forEach(rg => {
          rg.percentage = 100.0 / artist.relatedArtists.length * rg.count;
      })
    }
  }

  public async getArtistGroupsFromMusicTastes(musicTastes: MusicTasteModel[]): Promise<SpotifyArtistGroup[]> {
    const artistGroups: SpotifyArtistGroup[] = []
    for (let musicTaste of musicTastes) {
      const artistPromises: Promise<SpotifyArtist>[] = [];
      const genres: SpotifyGenre[] = []
      for (let artistId of musicTaste.artistIds) {
        artistPromises.push(this.spotifyService.getArtist(artistId))
      }

      for (let genre of musicTaste.genreFeatures) {
        genres.push(new SpotifyGenre(genre.genre, 0, genre.percentage));
      }
      
      const artists = await Promise.all(artistPromises);
      artistGroups.push(new SpotifyArtistGroup(artists, genres, musicTaste.isDisabled));
    }
    
    return artistGroups;
  }
}