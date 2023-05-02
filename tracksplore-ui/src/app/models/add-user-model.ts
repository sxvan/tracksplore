export class AddUserModel {
    constructor(
        private displayName: string,
        private email: string,
        private password: string,
        private birthDate: Date,
        private gender: number,
        private spotifyId: string | undefined = undefined) {

    }
}