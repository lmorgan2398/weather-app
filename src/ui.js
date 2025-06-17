import { parse } from 'date-fns';
import { format } from 'date-fns-tz';

const renderData = function(data) {
    renderOverview(data);
    renderTodayInfo(data);
}

const renderOverview = function(data) {
    // Declare query selectors
    const overviewEle = document.querySelector('.overview');
    const locationEle = document.querySelector('.overview .location');
    const timeEle = document.querySelector('.overview .time');
    const temperatureEle = document.querySelector('.overview .temperature');
    const weatherEle = document.querySelector('.overview .weather');
    const dayNightEle = document.querySelector('.overview .day-night');

    // Get the current condition for use in later functions
    const condition = data.currentConditions.conditions;

    // Set background of overview using classes
    const conditionClass = parseConditionClass(condition);
    overviewEle.className = `overview ${conditionClass}`;

    // Set location to resolved address
    locationEle.textContent = `${data.resolvedAddress}`;

    // Set current time to the UTC converted to the local time zone
    let timeZone = data.timezone;
    let currentTime = parse(data.currentConditions.datetime, 'HH:mm:ss', new Date());
    let formattedTime = format(currentTime, 'h:mm aa zzz', { timeZone });
    timeEle.textContent = `As of ${formattedTime}`;

    // Current temperature rounded down
    temperatureEle.textContent = `${Math.floor(data.currentConditions.temp)}\u00B0F`;

    // Summary of current conditions
    weatherEle.textContent = `${condition}`;

    // High and lows for the day, rounded
    dayNightEle.textContent = `High ${Math.floor(data.days[0].tempmax)}\u00B0F \u2022 Low ${Math.floor(data.days[0].tempmin)}\u00B0F`;
}

// Function to get the appropriate class to apply to the overview element for its background
const parseConditionClass = function (condition) {
    // Account for case sensitivity
    const cond = condition.toLowerCase();

    // Return a class based on the conditions from API
    if (cond.includes('t-storm') || cond.includes('thunder')) return 'thunderstorm';
    if (cond.includes('snow') || cond.includes('flurries') || cond.includes('sleet') || cond.includes('ice')) return 'snow';
    if (cond.includes('rain') || cond.includes('shower') || cond.includes('drizzle')) return 'rain';
    if (cond.includes('fog') || cond.includes('haze') || cond.includes('mist') || cond.includes('smoke')) return 'fog';
    if (cond.includes('cloud') || cond.includes('overcast')) return 'cloudy';
    if (cond.includes('sun') || cond.includes('clear')) return 'clear';

    // Return default in case there is an issue parsing for a condition class
    return 'default';
}

const renderTodayInfo = function(data) {
    // Declare query selectors
    const todayHeaderEle = document.querySelector('.today-header p');
    const feelsLikeEle = document.querySelector('.basic-info .feels-like .temp');
    const sunriseEle = document.querySelector('.basic-info .sunrise p');
    const sunsetEle = document.querySelector('.basic-info .sunset p');
    const highLowEle = document.querySelector('.high-low .stats');
    const windEle = document.querySelector('.wind .stats');
    const humidityEle = document.querySelector('.humidity .stats');
    const dewPointele = document.querySelector('.dew-point .stats');
    const pressureEle = document.querySelector('.pressure .stats');
    const uvIndexEle = document.querySelector('.uv-index .stats');
    const visibility = document.querySelector('.visibility .stats');
    const moonPhaseEle = document.querySelector('.moon-phase .stats');

    // Declare other constants
    const inHgConversionValue = 33.8639;

    // Populate header with current info
    todayHeaderEle.textContent = `Weather Today in ${data.resolvedAddress}`;
    feelsLikeEle.textContent = `${Math.floor(data.currentConditions.temp)}\u00B0F`;

    // Format and populate sunrise and sunset times
    let sunriseTime = parse(data.currentConditions.sunrise, 'HH:mm:ss', new Date());
    let sunsetTime = parse(data.currentConditions.sunset, 'HH:mm:ss', new Date());
    let formattedSunriseTime = format(sunriseTime, 'h:mm aa');
    let formattedSunsetTime = format(sunsetTime, 'h:mm aa');
    sunriseEle.textContent = `${formattedSunriseTime}`;
    sunsetEle.textContent = `${formattedSunsetTime}`;

    // Add stats info text to each elemenet
    highLowEle.textContent = `${Math.floor(data.days[0].tempmax)}\u00B0/${Math.floor(data.days[0].tempmin)}\u00B0`;
    windEle.textContent = `${data.currentConditions.windspeed}mph`;
    humidityEle.textContent = `${Math.floor(data.currentConditions.humidity)}%`;
    dewPointele.textContent = `${Math.floor(data.currentConditions.dew)}%`;
    pressureEle.textContent = `${Number((Number(data.currentConditions.pressure) / inHgConversionValue)).toFixed(2)} in`;
    uvIndexEle.textContent = `${data.currentConditions.uvindex} of 11`;
    visibility.textContent = `${data.currentConditions.visibility} mi`
    moonPhaseEle.textContent = parseMoonPhaseName(data.currentConditions.moonphase);
}

function parseMoonPhaseName(phase) {
  if (phase < 0.03 || phase >= 0.97) return 'New Moon';
  if (phase < 0.22) return 'Waxing Crescent';
  if (phase < 0.28) return 'First Quarter';
  if (phase < 0.47) return 'Waxing Gibbous';
  if (phase < 0.53) return 'Full Moon';
  if (phase < 0.72) return 'Waning Gibbous';
  if (phase < 0.78) return 'Last Quarter';
  return 'Waning Crescent';
}



export { renderData }