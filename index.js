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

const filter = document.querySelectorAll(`.filter`);
const filterContainer = document.querySelector(`.filters-container`);

filterContainer.addEventListener('click', (e) => {
    console.log(e.target.closest('.filter'))
})