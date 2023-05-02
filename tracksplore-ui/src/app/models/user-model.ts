export class UserModel {
    constructor(public displayName: string, public email: string, public birthdate: Date, public gender: number, public spotifyId: string | undefined) {
        
    }
}