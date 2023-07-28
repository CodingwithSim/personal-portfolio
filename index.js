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

// const filter = document.querySelectorAll(`.filter`);
// const filterContainer = document.querySelector(`.filters-container`);

// filterContainer.addEventListener('click', (e) => {

// })


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