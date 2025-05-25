const clientId = '062d4b6328d54845ab4effd363440f06';
const secretClientId = "a9d2ab16c6c24c7da06e743ba97483c6";
const redirectUri = 'https://alvaro277.github.io/Jammming/';
const baseUrl = 'https://api.spotify.com/v1/';
let accessToken;
let expiresAtToken;

const Spotify = {
    async requestToken() {
        const urlToFetch = "https://accounts.spotify.com/api/token";
        try {
            const response = await fetch(urlToFetch, {
                method: "POST",
                headers: { "Content-type": "application/x-www-form-urlencoded" },
                body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secretClientId}`
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                expiresAtToken = Date.now() + (jsonResponse.expires_in * 1000);
                accessToken = jsonResponse.access_token;
                console.log(accessToken);
                console.log(expiresAtToken);
                return { accessToken: accessToken, expiresAt: expiresAtToken };
            }
        } catch (error) {
            console.log(error);
        }
    },

    async getToken() {
        if (accessToken && (Date.now() - expiresAtToken < 3600 * 1000)) {
            return accessToken;
        } else {
            const objToken = await this.requestToken();
            accessToken = objToken.accessToken;
            expiresAtToken = objToken.expiresAt;
            return accessToken; 
        }
    },

    async searchTrack(term,author) {
        const urlToFetch = baseUrl + 'search?type=track&q=track:' + encodeURIComponent(term) + '%20artist:' + encodeURIComponent(author); 
        const accessToken = await this.getToken(); 
        try {
            const response = await fetch(urlToFetch, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const responseJson = await response.json();
                return responseJson.tracks.items; 
            }
        } catch (error) {
            console.log(error);
        }
    }
}


const tracks = Spotify.searchTrack('Butterfly','Travis Scott');
tracks.then(function(result) {
console.log(result);
});