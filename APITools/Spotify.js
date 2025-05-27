const clientId = '062d4b6328d54845ab4effd363440f06';
const redirectUri = 'https://alvaro277.github.io/Jammming/';
const baseUrl = 'https://api.spotify.com/v1';
let accessToken;
let expiresAtToken;

const Spotify = {
    async getAccessToken() {
        if (accessToken) return accessToken;

        const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (tokenMatch && expiresInMatch) {
            accessToken = tokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public user-read-private&redirect_uri=${encodeURIComponent(redirectUri)}`;
            window.location = accessUrl;
        }
    },

    async getCurrentUserId() {
        accessToken = this.getAccessToken();
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.id;
        } else {
            console.log('Failed to fetch user ID');
        }
    },

    async searchTrack(song,artist){
        const accessToken = await this.getAccessToken();
        const endPoint = '/search?';
        const urlToFetch = baseUrl + endPoint + `q=track:${encodeURIComponent(song)} artist:${encodeURIComponent(artist)}&type=track`;
        try{
        const response = await fetch(urlToFetch, {
            headers:{
                Authorization : `Bearer ${accessToken}`
            }
        });
        if(response.ok){
            const responseJson = await response.json();
            return responseJson.tracks.items;
        }}catch(error){
            console.log(error);
        }
    }
};


// const tracks = Spotify.searchTrack('Butterfly','Travis Scott');
// tracks.then(function(result) {
// console.log(result);
// });

const user = Spotify.getCurrentUserId();
user.then((result) => console.log(result));
