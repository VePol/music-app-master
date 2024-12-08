import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';  // Import cors

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files (like HTML, CSS, and JS)
app.use(express.static('public'));

// Root route (optional, just for testing)
app.get('/', (req, res) => {
    res.send('Welcome to the Music Information App!');
});

// Search route for artist
app.get('/search', async (req, res) => {
    const artistName = req.query.artist;
    const apiKey = process.env.LASTFM_API_KEY;

    if (!artistName) {
        return res.status(400).json({ error: 'Artist name is required.' });
    }

    try {
        // Fetch artist information from Last.fm
        const artistResponse = await axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'artist.getinfo',
                artist: artistName,
                api_key: apiKey,
                format: 'json',
            },
        });

        // Fetch top albums of the artist from Last.fm
        const albumsResponse = await axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'artist.gettopalbums',
                artist: artistName,
                api_key: apiKey,
                format: 'json',
            },
        });

        // Combine artist information and album data into a single response
        const artistData = {
            artist: artistResponse.data.artist,
            topalbums: albumsResponse.data.topalbums,
        };

        res.json(artistData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Last.fm.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
