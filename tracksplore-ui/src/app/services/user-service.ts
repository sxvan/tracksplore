import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AddUserModel } from "../models/add-user-model";
import { UserModel } from "../models/user-model";

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {}

    add(model: AddUserModel) {
        return this.http.post<UserModel>('https://localhost:7192/api/User', model);
    }

    get() {
        return this.http.get<UserModel>('https://localhost:7192/api/User');
    }
}