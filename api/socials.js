
import { fetch } from 'undici';

export default async function handler(req, res) {
  try {
    const results = {
      twitch: { live: false, url: "https://www.twitch.tv/marrantclub" },
      youtube: { lastVideoUrl: "https://www.youtube.com/@marrant_club", title: "" },
      instagram: { url: "https://www.instagram.com/marrant_club/" }
    };

    const youtubeChannelId = "UCQ9v8oGqAY3qTIHOZKYk32w"; 
    try {
      const ytRss = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`);
      if (ytRss.ok) {
        const text = await ytRss.text();
        const match = text.match(/<entry>[\s\S]*?<link rel="alternate" href="(https:\/\/www\.youtube\.com\/watch\?v=.*?)"[\s\S]*?<title>(.*?)<\/title>/);
        if (match) {
          results.youtube.lastVideoUrl = match[1];
          results.youtube.title = match[2];
        }
      }
    } catch (e) {
      console.error("YT RSS Error:", e);
    }

    // 2. Twitch - Requires Client ID / Secret in Env
    const twitchClientId = process.env.TWITCH_CLIENT_ID;
    const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
    
    if (twitchClientId && twitchClientSecret) {
      try {
        // Get OAuth Token
        const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchClientSecret}&grant_type=client_credentials`, {
          method: 'POST'
        });
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        // Get Stream Info
        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=marrantclub`, {
          headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${token}`
          }
        });
        const streamData = await streamResponse.json();
        results.twitch.live = streamData.data && streamData.data.length > 0;
      } catch (e) {
        console.error("Twitch API Error:", e);
      }
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
