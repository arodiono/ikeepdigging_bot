const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function auth() {
    const data = await spotifyApi.clientCredentialsGrant();

    console.debug(data.body['access_token']);

    spotifyApi.setAccessToken(data.body['access_token']);
}

function parseAlbumId(href) {
    const url = new URL(href)
    return url.pathname.split('/').pop()
}

async function getAlbum(href) {
    await auth()

    const albumId = parseAlbumId(href);
    const { body: album } = await spotifyApi.getAlbum(albumId, { market: 'UA' });

    console.debug(album);

    return {
        link: album?.external_urls?.spotify,
        photo: album?.images?.sort((img1, img2) => img2.height - img1.height)?.[0].url,
        thumb: album?.images?.sort((img1, img2) => img1.height - img2.height)?.[0].url,
        artistName: album?.artists?.map(artist => artist.name)?.join(', '),
        albumName: album?.name,
        genres: album?.genres?.join(', '),
        year: album?.release_date?.split('-')?.[0],
    }
}

module.exports = {
    getAlbum
}