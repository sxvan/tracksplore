import { AddGenreFeatureModel } from "./add-genre-feature-model";

export class AddMusicTasteModel {
    constructor(private artistIds: string[], private isDisabled: boolean, private genreFeatures: AddGenreFeatureModel[]) { }
}