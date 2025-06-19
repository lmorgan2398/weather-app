import './styles.css';
import * as ui from './ui.js';
import * as api from './api.js';

const loadWeather = async function(location) {
    try {
        const weatherData = await api.getWeatherData(location);
        ui.renderData(weatherData);
    } catch (err) {
        console.error('Weather loading failed:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadWeather('Nashville, IL'));


// Declare interactable query selectors
let searchInput = document.querySelector('#search');
let searchButton = document.querySelector('.search-button');

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && searchInput.value.trim(' ') !== ''){
        loadWeather(searchInput.value);
        searchInput.value = '';
    }
});

searchButton.addEventListener('click', () => {
    if(searchInput.value.trim(' ') !== '') {
        loadWeather(searchInput.value);
        searchInput.value = '';
    }
});