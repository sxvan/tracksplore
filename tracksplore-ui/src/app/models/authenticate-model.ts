import { UserModel } from "./user-model"

export interface AuthenticateModel {
    token: string
    user: UserModel
}