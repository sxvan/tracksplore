import { HttpClient } from "@angular/common/http";
import { AddMusicTasteModel } from "../models/add-music-taste-model";
import { Injectable } from "@angular/core";
import { MusicTasteModel } from "../models/music-taste-model";
import { Observable, retry, tap } from "rxjs";

@Injectable()
export class MusicTasteService {
    constructor(private http: HttpClient) { }

    add(model: AddMusicTasteModel) {
        return this.http.post<MusicTasteModel>('https://localhost:7192/api/MusicTaste', model);
    }

    get(): Observable<MusicTasteModel[]> {
        return this.http.get<MusicTasteModel[]>('https://localhost:7192/api/MusicTaste').pipe(tap(() => console.log('failed')), retry(5));
    }
}