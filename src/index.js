import './styles.css';
import * as ui from './ui.js';
import * as api from './api.js';

const loadWeather = async function() {
    try {
        const weatherData = await api.getWeatherData('new york city, IL');
        ui.renderData(weatherData);
    } catch (err) {
        console.error('Weather loading failed:', err);
    }
}

loadWeather();