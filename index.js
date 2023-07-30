// MAP //
// MAP //
// MAP //

mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltYmF6YWpvdGEiLCJhIjoiY2xrNGd6MDAxMHR6MzNtb3loODVremp0NSJ9.b1PuHNLwqm-py9vsXdXcjA';

const setMapStyle = function () {
    const rootElem = document.documentElement
    let dataTheme = rootElem.getAttribute('data-theme'),
        newTheme

    newTheme = (dataTheme === 'light') ? 'dark' : 'light'

    const mapStyle = (newTheme === 'light')
        ? 'dark-v10'
        : 'light-v10';
    return mapStyle;
};

const setMapTheme = function () {
    const mapTheme = `mapbox://styles/mapbox/${setMapStyle()}`;
    return mapTheme;
};



function setupMap() {
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: setMapTheme(), // style URL
        zoom: 11, // starting zoom
        center: [0.0221, 51.4806], // starting position
        attributionControl: false,
    });

    map.scrollZoom.disable()
    map.touchZoomRotate.enable();
    map.addControl(new mapboxgl.NavigationControl());


    map.on('load', () => {
        // Load an image from an external URL.
        map.loadImage(
            'assets/memoji4.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('memoji', image);

                // Add a data source containing one point feature.
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [0.0221, 51.4806]
                                }
                            }
                        ]
                    }
                });

                // Add a layer to use the image to represent the data.
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', // reference the data source
                    'layout': {
                        'icon-image': 'memoji', // reference the image
                        'icon-size': 0.2,
                    }
                });
            }
        );
    });

}
setupMap();


// THEME TOGGLE //
// THEME TOGGLE //
// THEME TOGGLE //

const switchTheme = () => {
    // Get root element and data-theme value
    const rootElem = document.documentElement
    let dataTheme = rootElem.getAttribute('data-theme'),
        newTheme

    newTheme = (dataTheme === 'light') ? 'dark' : 'light'

    // Set the new HTML attribute
    rootElem.setAttribute('data-theme', newTheme)

    // Set the new local storage
    localStorage.setItem('theme', newTheme)
    setupMap()
}

// Check local storage
let localS = localStorage.getItem('theme'),
    themeToSet = localS

//If local storage is not set, we check the OS preference
if (!localS) {
    themeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

//set the correct theme
document.documentElement.setAttribute('data-theme', themeToSet)
setupMap()

// Set event listener for the theme switcher
document.querySelector(`.theme-switcher`).addEventListener(`click`, switchTheme)


// FILTER //
// FILTER //
// FILTER //


function filterProduct(value) {
    //Button class code
    let filters = document.querySelectorAll(".filter");
    filters.forEach((filter) => {
        //check if value equals innerText
        if (value.toUpperCase() == filter.innerText.toUpperCase()) {
            filter.classList.add("active");
        } else {
            filter.classList.remove("active");
        }
    });
    //select all cards
    let cards = document.querySelectorAll(".card");
    //loop through all cards
    cards.forEach((card) => {
        //display all cards on 'all' button click
        if (value == "all") {
            card.classList.remove("inactive");
        } else {
            //Check if element contains category class
            if (card.classList.contains(value)) {
                //display element based on category
                card.classList.remove("inactive");
            } else {
                //inactive other cards
                card.classList.add("inactive");
            }
        }
    });
}


const filter = document.querySelectorAll(`.filter`);
const filterContainer = document.querySelector(`.filters-container`);



filterContainer.addEventListener(`click`, function (event) {
    const clicked = event.target.closest(`.filter`);
    if (!clicked) return;
    filter.forEach(filter => filter.classList.remove(`active`));
    clicked.classList.add(`active`);
    document.querySelector(`.card-intro`).setAttribute(`id`, `card-intro-${clicked.dataset.filter}`);
    document.querySelector(`.card-map`).setAttribute(`id`, `card-map-${clicked.dataset.filter}`);
    document.querySelector(`.card-contact`).setAttribute(`id`, `card-contact-${clicked.dataset.filter}`);
    document.querySelector(`.card-skills`).setAttribute(`id`, `card-skills-${clicked.dataset.filter}`);
    // document.querySelector(`.card-spotify`).setAttribute(`id`, `card-spotify-${clicked.dataset.filter}`);
    document.querySelector(`.card-github`).setAttribute(`id`, `card-github-${clicked.dataset.filter}`);
    document.querySelector(`.card-linkedin`).setAttribute(`id`, `card-linkedin-${clicked.dataset.filter}`);
    document.querySelector(`.card-vanlife`).setAttribute(`id`, `card-vanlife-${clicked.dataset.filter}`);
    document.querySelector(`.card-quizzical`).setAttribute(`id`, `card-quizzical-${clicked.dataset.filter}`);
    console.log(clicked)
})

//Initially display all products
window.onload = () => {
    filterProduct("all");
};


// SPOTIFY API
// SPOTIFY API
// SPOTIFY API


const clientSecret = "afa9443db3ce408cad6bdccc5cdd4877";

// app.js

// Your Spotify Developer Client ID and Redirect URI
const clientId = "f1c236007d4d446e8277ecc86d4c2319";
const redirectUri = "https://wondrous-pie-af47eb.netlify.app/"; // Set this to the URI you've configured in your Spotify Developer Dashboard

// Check if the access token is present in the URL (after user authorization)
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get("access_token");

if (accessToken) {
    // Hide the login button and show the last played card
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("lastPlayedCard").style.display = "block";

    // Fetch the last played song using the access token
    fetchLastPlayedSong(accessToken);
} else {
    // If the access token is not present, show the login button
    document.getElementById("loginBtn").addEventListener("click", () => {
        // Redirect the user to Spotify's authorization page
        const scopes = "user-read-recently-played"; // Add any additional scopes you need
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
        window.location.href = authUrl;
    });
}

function fetchLastPlayedSong(token) {
    fetch("https://api.spotify.com/v1/me/player/recently-played", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const lastPlayed = data.items[0].track;
            console.log(lastPlayed)
            const trackName = lastPlayed.name;
            const artist = lastPlayed.artists.map(artist => artist.name).join(", ");
            const albumArtUrl = lastPlayed.album.images[0].url;

            document.getElementById("trackName").textContent = "Track: " + trackName;
            document.getElementById("artist").textContent = "Artist(s): " + artist;
            document.getElementById("albumArt").src = albumArtUrl;
        })
        .catch(error => {
            console.error("Error fetching last played song:", error);
        });
} 
