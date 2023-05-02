import { GenreFeatureModel } from "./genre-feature-model";

export class MusicTasteModel {
    constructor(public artistIds: string[], public isDisabled: boolean, public genreFeatures: GenreFeatureModel[]) { }
}