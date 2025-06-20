import './styles.css';
import * as ui from './ui.js';
import * as api from './api.js';

// Define primary function for site
const loadWeather = async function(location, system) {
    try {
        const weatherData = await api.getWeatherData(location, system);
        currentLocation = weatherData.resolvedAddress;
        ui.renderData(weatherData, system);
        return true;
    } catch (err) {
        console.error('Weather loading failed:', err);
        throw err;
    }
}


// Define variable to store location returned from API to site
let currentLocation = 'Nashville, IL';
// Define user-selected variable for degree measurement system
let degreeSystem = 'us';

// Select degrees switch button and add switch to edit degree system variable
let degreesButton = document.querySelector('.degrees-button');
degreesButton.addEventListener('click', () => {
    // Get text content from site
    if (degreeSystem == 'us') {
        degreeSystem = 'metric';
        loadWeather(currentLocation, degreeSystem);
        searchInput.value = '';
    } else {
        degreeSystem = 'us';
        loadWeather(currentLocation, degreeSystem);
        searchInput.value = '';
    }
})

// Execute primary function upon Dom loaded
document.addEventListener('DOMContentLoaded', loadWeather('Nashville, IL', degreeSystem));

// Declare interactable query selectors
let searchInput = document.querySelector('#search');
let searchButton = document.querySelector('.search-button');

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && searchInput.value.trim(' ') !== ''){
        loadWeather(searchInput.value, degreeSystem)
            .then(() => {
                console.log('I made it here');
                searchInput.value = '';
            })
            .catch(console.log);
    }
});

searchButton.addEventListener('click', () => {
    if(searchInput.value.trim(' ') !== '') {
        loadWeather(searchInput.value, degreeSystem)
            .then(() => {
                console.log('I made it here');
                searchInput.value = '';
            })
            .catch(console.log);
    }
});
