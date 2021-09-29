const Discogs = require('disconnect').Client;

const db = new Discogs({
    consumerKey: process.env.DISCOGS_CONSUMER_KEY,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
}).database();

async function getGenres(query) {
    const { results } = await db.search({
        query,
        type: 'master'
    })

    console.debug(results);

    const master = results?.[0];
    const genre = master?.genre || [];
    const style = master?.style || [];
    return [...genre, ...style].join(', ')
}

module.exports = {
    getGenres
}