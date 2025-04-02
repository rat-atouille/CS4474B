import albumData from "../src/assets/data/data.json";
import podcastData from "../src/assets/data/podcastData.json";
import playlistData from "../src/assets/data/playlistData.json";

const getStructuredData = (type, name, index) => {
    let structuredData = [];

    // Utility function to match and format the song data
    const formatSongData = (author, image, name, song) => ({
        author,
        image,
        name,
        title: song.name,
        duration: song.durationMs
    });

    switch (type) {
        case "album":
            // Flatten albums data and filter by name
            structuredData = Object.entries(albumData).flatMap(([artistName, artist]) =>
                artist.albums
                    .filter(album => album.name.toLowerCase().includes(name.toLowerCase()))
                    .map(album => ({
                        tracks: album.songs.map(song => formatSongData(artistName, album.image, album.name, song))
                    }))
            );
            break;

        case "podcast":
            // Filter podcasts by name and format episode data
            structuredData = Object.entries(podcastData).map(([podcastName, podcast]) => {
                if (podcastName.toLowerCase().includes(name.toLowerCase())) {
                    return {
                        author: podcast.publisher,
                        name: podcastName,
                        tracks: podcast.episodes.map(episode => formatSongData(podcast.publisher, episode.image, podcastName, episode))
                    };
                }
                return null;
            }).filter(podcast => podcast !== null);
            break;

        case "playlist-liked":
            // Handle Liked Songs playlist
            if (playlistData["Liked Songs"] && Array.isArray(playlistData["Liked Songs"])) {
                structuredData = playlistData["Liked Songs"].map(song => formatSongData(song.artist, song.image, "Liked Songs", song));
            }
            break;

        case "playlist-album":
            // Handle Albums playlist
            structuredData = Object.entries(albumData).flatMap(([artistName, artist]) =>
                artist.albums
                    .filter(album => album.name.toLowerCase().includes(name.toLowerCase()))
                    .map(album => ({
                        tracks: album.songs.map(song => formatSongData(artistName, album.image, album.name, song))
                    }))
            );
            break;

        case "playlist-artist":
            structuredData = Object.entries(albumData)
            .filter(([artistName]) => artistName.toLowerCase().includes(name.toLowerCase()))
            .flatMap(([artistName, artist]) => 
                artist.albums.length > 0 
                    ? artist.albums[0].songs.map(song => formatSongData(artistName, artist.albums[0].image, artist.albums[0].name, song))
                    : []
            );
            break;
        default:
            break;
    }

    return { type, structuredData, index };
};

export default getStructuredData;
