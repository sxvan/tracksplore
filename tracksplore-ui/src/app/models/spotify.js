export function connectSpotify(access_token, callback) {
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = access_token;      
        const player = new Spotify.Player({
            name: 'Tracksplore Web Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.1
        });

        
        player.addListener('ready', ({ device_id }) => {
            callback(player, device_id);
        });

        window.addEventListener('click', () => {
            player.activateElement();
        })

        player.connect();
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.getElementsByTagName('body')[0].appendChild(script);
}