// MAP //

mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltYmF6YWpvdGEiLCJhIjoiY2xrNGd6MDAxMHR6MzNtb3loODVremp0NSJ9.b1PuHNLwqm-py9vsXdXcjA';

const setMapStyle = function () {
    const mapStyle = document.body.classList.contains('dark')
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

const themeToggle = document.querySelector(`.theme-toggle-container`);
const body = document.querySelector(`body`);

themeToggle.addEventListener(`click`, function () {
    themeToggle.classList.toggle(`dark`);
    body.classList.toggle(`dark`);
    setupMap();
});

// THEME FROM LOCAL STORAGE //
// THEME FROM LOCAL STORAGE //
// THEME FROM LOCAL STORAGE //

function detectColorScheme() {
    // CHECK LOCAL STORAGE FIRST
    if (localStorage.getItem(`theme`)) {
        if (localStorage.getItem(`theme`) == `dark`) {
            body.classList.add(`dark`);
            toggle.classList.add(`dark`);
            setupMap();
        }
        if (localStorage.getItem(`theme`) == `light`) {
            body.classList.remove(`dark`);
            toggle.classList.remove(`dark`);
            setupMap();
        }
        // CHECK SYSTEM PREFERENCES
    } else if (!window.matchMedia) {
        return false;
    } else if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
        localStorage.setItem(`theme`, `dark`);
        body.classList.add(`dark`);
        toggle.classList.add(`dark`);
        setupMap();
    }
    // DETECT CHANGES AND RELOAD THEME
    window
        .matchMedia(`(prefers-color-scheme: dark)`)
        .addEventListener(`change`, function (event) {
            const colorScheme = event.matches ? `dark` : `light`;

            if (colorScheme === 'dark') {
                body.classList.add(`dark`);
                toggle.classList.add(`dark`);
                setupMap();
            } else {
                body.classList.remove(`dark`);
                toggle.classList.remove(`dark`);
                setupMap();
            }
        });
}
detectColorScheme();
