import './styles.css';
import * as ui from './ui.js';
import * as api from './api.js';

// Define primary function for site
const loadWeather = async function(location, system) {
    try {
        const weatherData = await api.getWeatherData(location, system);
        const rainfallData = await api.getRainfallData(location, system);
        currentLocation = weatherData.resolvedAddress;
        ui.renderData(weatherData, rainfallData, system);
        return true;
    } catch (err) {
        console.error('Weather loading failed:', err);
        throw err;
    }
}

// Define variable to store location returned from API to site
let currentLocation;
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
document.addEventListener('DOMContentLoaded', async () => {
    try {
        let ipData = await api.getIPData();
        currentLocation = `${ipData.city} ${ipData.subdivision} ${ipData.country}`;   
        loadWeather(currentLocation, degreeSystem);
    } catch {
        currentLocation = `New York City, NY`;
        loadWeather(currentLocation, degreeSystem);
    }
});

// Declare interactable query selectors
let searchInput = document.querySelector('#search');
let searchButton = document.querySelector('.search-button');

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && searchInput.value.trim(' ') !== ''){
        loadWeather(searchInput.value, degreeSystem)
            .then(() => {
                searchInput.value = '';
            })
            .catch(console.log);
    }
});

searchButton.addEventListener('click', () => {
    if(searchInput.value.trim(' ') !== '') {
        loadWeather(searchInput.value, degreeSystem)
            .then(() => {
                searchInput.value = '';
            })
            .catch(console.log);
    }
});
