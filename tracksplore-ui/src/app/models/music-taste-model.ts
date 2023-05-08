import { GenreFeatureModel } from "./genre-feature-model";

export class MusicTasteModel {
    constructor(public id: string, public artistIds: string[], public isDisabled: boolean, public genreFeatures: GenreFeatureModel[]) { }
}