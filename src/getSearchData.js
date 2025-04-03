import albumData from "../src/assets/data/data.json";
import podcastData from "../src/assets/data/podcastData.json";
import playlistData from "../src/assets/data/playlistData.json";

const getSearchData = (category) => {
    let results = [];

    switch (category) {
        case "songs":
            results = Object.entries(albumData).flatMap(([artist, artistData]) => {
                if (artistData.albums) {
                    return artistData.albums.flatMap((album) =>
                        album.songs.map((song) => ({
                            name: song.name,
                            image: song.image,
                            durationMs: song.durationMs,
                        }))
                    );
                }
                return [];
            });
            break;

        case "playlists":
            if (playlistData.Playlist) {
                results = Object.keys(playlistData.Playlist).map((playlistName) => ({
                    name: playlistName,
                    image: playlistData.Playlist[playlistName][0]?.image || "", // Use first song’s image if available
                }));
            }
            break;

        case "albums":
            results = Object.entries(albumData).flatMap(([artist, artistData]) => {
                if (artistData.albums) {
                    return artistData.albums.map((album) => ({
                        name: album.name,
                        image: album.songs[0]?.image || null, // Use first song’s image if available
                    }));
                }
                return [];
            });
            break;

        case "podcasts":
            results = Object.entries(podcastData).map(([podcastName, podcast]) => ({
                name: podcastName,
                image: podcast.episodes[0]?.image || "", // Use first episode's image if available
            }));
            break;

        case "artists":
            results = Object.entries(albumData).map(([artist, artistData]) => ({
                name: artist,
                image: artistData.image || null, // Assuming artistData contains the image field
            }));
            break;

        default:
            break;
    }

    console.log(results)

    return results;
};

export default getSearchData;
