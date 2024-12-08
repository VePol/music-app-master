// Base URL for your backend server
const BASE_URL = 'http://localhost:3000/search'; // Adjust this if deployed elsewhere

// Add an event listener to the 'search-button' element to trigger a search when clicked
document.getElementById('search-button').addEventListener('click', () => {
    // Get the artist name entered by the user from the input field and trim any extra spaces
    const artist = document.getElementById('artist-search').value.trim();
    // If an artist name is entered, call the fetchArtistInfo function to fetch the artist's details
    if (artist) {
        fetchArtistInfo(artist);
    }
});

// Define an asynchronous function to fetch the artist's information from the server
async function fetchArtistInfo(artistName) {
    try {
        const response = await fetch(`${BASE_URL}?artist=${artistName}`);
        const data = await response.json();

        // Log the response data to check if we get the expected structure
        console.log("Artist Info Data:", data);

        // If there's an error in the API response, show an alert
        if (data.error) {
            alert(data.error);
            return;
        }

        // Display the artist information (name and bio)
        displayArtistInfo(data.artist);
        // Fetch the artist's top albums after successfully fetching the artist's info
        fetchAlbums(artistName);
    } catch (error) {
        // If there's an error during the fetch process, log it to the console
        console.error('Error fetching artist info:', error);
    }
}

// Define a function to display the artist's name and bio on the page
function displayArtistInfo(artist) {
    // Update the content of the artist's name element with the artist's name
    document.getElementById('artist-name').textContent = artist.name;
    // Update the content of the artist's bio element with the artist's bio summary
    document.getElementById('artist-bio').textContent = artist.bio.summary;
}

// Define an asynchronous function to fetch the artist's top albums from the server
async function fetchAlbums(artistName) {
    try {
        const response = await fetch(`${BASE_URL}?artist=${artistName}`);
        const data = await response.json();

        // Log the album data to check the response structure
        console.log("Album Data:", data);

        // Get the album list container element to display the albums
        const albumList = document.getElementById('album-list');
        albumList.innerHTML = ''; // Clear any existing content in the album list

        // Check if the response contains albums and render them
        if (data.topalbums && data.topalbums.album) {
            data.topalbums.album.forEach(album => {
                const albumDiv = document.createElement('div');
                albumDiv.className = 'album';

                // Ensure that the image URL is properly loaded
                const img = document.createElement('img');
                img.src = album.image[2]['#text'] || 'default-album.jpg'; // Use default if image is missing
                
                // Create a paragraph element to display the album's title
                const title = document.createElement('p');
                title.className = 'album-title';
                title.textContent = album.name;

                // Append the image and title to the album div
                albumDiv.appendChild(img);
                albumDiv.appendChild(title);

                // Append the album div to the album list container
                albumList.appendChild(albumDiv);
            });
        } else {
            albumList.innerHTML = '<p>No albums found for this artist.</p>';
        }
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}
