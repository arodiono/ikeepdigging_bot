const TelegramBot = require('node-telegram-bot-api');
const uuid = require('uuid');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

const Spotify = require('./spotify');
const Discogs = require('./discogs');

bot.on('inline_query', async (inline_query) => {
    if (!inline_query.query) return;

    try {
        const album = await Spotify.getAlbum(inline_query.query);
        const genres = await Discogs.getGenres(`${album.artistName} - ${album.albumName}`);

        album.genres = genres;

        const answer = prepareAnswer(album);

        bot.answerInlineQuery(inline_query.id, [answer]);
    } catch (e) {
        console.error(e);
    }
})

function prepareAnswer(album) {
    return {
        id: uuid.v4(),
        type: 'photo',
        photo_url: album.photo,
        thumb_url: album.thumb,
        title: `*${album.artistName} – ${album.albumName}*`,
        description: `_${album.genres}_\n${album.year}`,
        caption: `​​*${album.artistName} – ${album.albumName}*\n_${album.genres}_\n${album.year}\n\n[Spotify](${album.link})`,
        parse_mode: 'Markdown',
    }
}
