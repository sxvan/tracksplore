import { Injectable } from "@angular/core";
import { SpotifyGenre } from "../models/spotify-genre";

@Injectable()
export class SpotifyGenreService {
    public getMergedGenres(genres: SpotifyGenre[], sourceLength: number, percentageTreshhold: number): SpotifyGenre[] {
        const mergedGenres: SpotifyGenre[] = [];

        genres.forEach(g => {
            let genre = mergedGenres.find(mg => mg.name === g.name);
            if (genre) {
                genre.count += g.count;
                genre.percentage += g.percentage / sourceLength;
            } else {
                genre = new SpotifyGenre(g.name, g.count, g.percentage / sourceLength);
                mergedGenres.push(genre);
            }
        });

        return mergedGenres.filter(mg => mg.percentage > percentageTreshhold);
    }

    public getSimilarity(genres: SpotifyGenre[], otherGenres: SpotifyGenre[]): number {
        let weightedSimilarity = 0;
        for (let genre of genres.filter(g => otherGenres.find(og => og.name == g.name))) {
            const otherGenre = otherGenres.find(og => og.name == genre.name);
            if (!otherGenre) {
                continue;
            }

            let unweightedSimilarity;
            if (genre.percentage >= otherGenre.percentage) {
                unweightedSimilarity = 100.0 / genre.percentage * otherGenre.percentage;
                
            } else {
                unweightedSimilarity = 100.0 / otherGenre.percentage * genre.percentage;
            }

            weightedSimilarity += 100.0 / genres.map(rg => rg.count).reduce((a, b) => a + b, 0) * genre.count * unweightedSimilarity / 100;
        }

        return weightedSimilarity;
    }

    public getTwoWaySimilarity(genres: SpotifyGenre[], otherGenres: SpotifyGenre[]): number {
        return (this.getSimilarity(genres, otherGenres) + this.getSimilarity(otherGenres, genres) / 2);
    }
}