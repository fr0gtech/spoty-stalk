import axios from "axios";
export const tweetSongSpotify = async (song:any, artists: any, playlist:any) => {
    await axios.post(`https://maker.ifttt.com/trigger/new_song_spotify/with/key/${process.env.IFTTT}`, {
        "value1": `${song.track.name} by ${artists.map((e:any)=>e.name).join(',')}`,
        "value2": playlist.name,
        "value3": song.track.external_urls.spotify
    })
}

export const tweetSongSoundcloud = async (song:any, artist:any) => {    
   await axios.post(`https://maker.ifttt.com/trigger/new_song_soundcloud/with/key/${process.env.IFTTT}`, {
        "value1": `${song.track.title} by ${artist.name}`,
        "value2": song.track.permalink_url,
    })
}