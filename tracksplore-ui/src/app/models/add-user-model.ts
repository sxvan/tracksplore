export interface AddUserModel {
    displayName: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: number,
    spotifyId: string | undefined
}