export class SpotifyDevice {
    constructor(public id: string, public name: string, public type: string) { }
}

export class SpotifyDeviceResult {
    constructor(public devices: SpotifyDevice[]) { }
}