import { parse, startOfHour } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';

// Import images
import thunderstorm from './images/icons/forecast-icons/thunderstorm.png';
import snow from './images/icons/forecast-icons/snow.png';
import rain from './images/icons/forecast-icons/rain.png';
import fog from './images/icons/forecast-icons/fog.png';
import cloudy from './images/icons/forecast-icons/cloudy.png';
import clear from './images/icons/forecast-icons/clear.png';

// Bind mapped values to object
const iconMap = {
    thunderstorm,
    snow,
    rain,
    fog,
    cloudy,
    clear
};

const renderData = function(data, rainfall, system) {
    // Use provided measurement system to store measurement units in obj units
    let units = {};
    if (system == 'us') {
        {
        units.degrees = `\u00B0F`,
        units.pressure = 'in',
        units.length = 'mi',
        units.speed = 'mph'
        units.inHgConversionValue = 33.8639;
        units.toFixed = 2,
        units.rainfall = 'in'
        }
    } else {
        {
            units.degrees = '\u00B0C',
            units.pressure = 'hPa',
            units.length = 'km',
            units.speed = 'kmph'
            units.inHgConversionValue = 1;
            units.toFixed = 0,
            units.rainfall = 'mm'
        }
    }
    toggleDegreesButton(units);
    renderOverview(data, units);
    renderTodayInfo(data, units);
    renderForecastInfo(data);
    renderTenDayInfo(data);
    renderWeeklyRainfallInfo(rainfall, units);
}

// Function to change display of degree measurement toggle button
const toggleDegreesButton = function(units) {
    let degreesButton = document.querySelector('.degrees-button');
    degreesButton.textContent = units.degrees;
} ;

// Function to render overview section
const renderOverview = function(data, units) {
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
    temperatureEle.textContent = `${Math.floor(data.currentConditions.temp)}${units.degrees}`;

    // Summary of current conditions
    weatherEle.textContent = `${condition}`;

    // High and lows for the day, rounded
    dayNightEle.textContent = `High ${Math.floor(data.days[0].tempmax)}${units.degrees} \u2022 Low ${Math.floor(data.days[0].tempmin)}${units.degrees}`;
}

// Function to get the appropriate class to apply to the overview element for its background
// Additionally, will apply an img src to hourly forecast info 
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

// Function to render todays info
const renderTodayInfo = function(data, units) {
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

    // Populate header with current info
    todayHeaderEle.textContent = `Weather Today in ${data.resolvedAddress}`;
    feelsLikeEle.textContent = `${Math.floor(data.currentConditions.temp)}${units.degrees}`;

    // Format and populate sunrise and sunset times
    let sunriseTime = parse(data.currentConditions.sunrise, 'HH:mm:ss', new Date());
    let sunsetTime = parse(data.currentConditions.sunset, 'HH:mm:ss', new Date());
    let formattedSunriseTime = format(sunriseTime, 'h:mm aa');
    let formattedSunsetTime = format(sunsetTime, 'h:mm aa');
    sunriseEle.textContent = `${formattedSunriseTime}`;
    sunsetEle.textContent = `${formattedSunsetTime}`;

    // Add stats info text to each elemenet
    highLowEle.textContent = `${Math.floor(data.days[0].tempmax)}\u00B0/${Math.floor(data.days[0].tempmin)}\u00B0`;
    windEle.textContent = `${data.currentConditions.windspeed}${units.speed}`;
    humidityEle.textContent = `${Math.floor(data.currentConditions.humidity)}%`;
    dewPointele.textContent = `${Math.floor(data.currentConditions.dew)}\u00B0`;
    pressureEle.textContent = `${Number((Number(data.currentConditions.pressure) / units.inHgConversionValue)).toFixed(units.toFixed)} ${units.pressure}`;
    uvIndexEle.textContent = `${data.currentConditions.uvindex} of 11`;
    visibility.textContent = `${data.currentConditions.visibility} ${units.length}`;
    moonPhaseEle.textContent = parseMoonPhaseName(data.currentConditions.moonphase);
}

// Helper function to parse the literal moon phase name from the API data
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

// Function to render the 24-hour hourly forecast
const renderForecastInfo = function(data) {
    let forecastHours = document.querySelectorAll('.forecast-container .hour');
    const hourlyForecastData = parse24HourData(data.days, data.timezone);
    forecastHours.forEach((hour) => {
        // Declare query selectors under each forecast hour
        const timeEle = hour.querySelector('.time');
        const forecastImg = hour.querySelector('.icon');
        const tempEle = hour.querySelector('.temp');
        const rainfallEle = hour.querySelector('.rainfall-text');

        // Get index of element
        const eleIndex = parseInt(hour.dataset.index, 10);

        // Get current hour's forecast data
        const currentData = hourlyForecastData[eleIndex];

        // Render data to elements
        let parsedTime = parse(currentData.time, 'HH:mm:ss', new Date());
        timeEle.textContent = format(parsedTime, 'h aa');

        let conditions = currentData.conditions;
        let forecastImgSrc = parseConditionClass(conditions);
        forecastImg.src = iconMap[forecastImgSrc];

        tempEle.textContent = `${Math.floor(currentData.temp)}\u00B0`;
        rainfallEle.textContent = `${currentData.precipProb}%`;
    })
}

// Function to select the upcoming 24 hours weather conditions from API data
const parse24HourData = function(days, timezone) {
    // Declare arrays of data pulled from API 
    const todayData = days[0];
    const tomorrowData = days[1];
    const HOURS_IN_DAY = 24;

    // Declare array of parsed data to return
    let hourlyData = [];
    
    // Get current time, rounded to nearest hour and formatted as in API
    const now = new Date();
    const zonedDate = toZonedTime(now, timezone);
    const currentHour = startOfHour(zonedDate);
    const formattedCurrentHour = format(currentHour, 'HH:mm:ss', {timezone});

    // Loop through and find today hour data that matches current hour
    // Offset start of 24-hour forecast based on current hour of day
    let currentHourOffset;
    for(let i = 0; i < HOURS_IN_DAY; i++) {
        if(todayData.hours[i].datetime == formattedCurrentHour)
        {
            currentHourOffset = i;
        }
    }

    // Create data objects representing the next 24 hours
    for (let i = 0; i < HOURS_IN_DAY; i++) {
        let currentDayData;
        // Start at the current hour using offset
        let forecastHour = i + currentHourOffset;
        // If the hour is past 23:59, loop into the next day and correct the forecast hour 
        // by 'resetting' to 0 with a -24 decrement and setting the day data to tomorrow
        if (forecastHour < HOURS_IN_DAY) {
            currentDayData = todayData;
        } else {
            currentDayData = tomorrowData;
            forecastHour -= 24;
        }
        // Create object with parsed data from API
        let currentHourData = currentDayData.hours[forecastHour]; 
        let currentHourDataParsed = {
            time: currentHourData.datetime,
            conditions: currentHourData.conditions,
            temp: currentHourData.temp,
            precipProb: currentHourData.precipprob
        }
        hourlyData.push(currentHourDataParsed);
    }
    return hourlyData;
}

const renderTenDayInfo = function(data) {
    let forecastDayEles = document.querySelectorAll('.ten-day-forecast-container .day');
    forecastDayEles.forEach((day) => {
        // Select elements under each day
        let dateEle = day.querySelector('.date');
        let rainfallEle = day.querySelector('.rainfall-text');
        let conditionEle = day.querySelector('.info .condition');
        let maxMinEle = day.querySelector('.max-min');
        let index = day.dataset.index;

        // Set date to today or otherwise, day of week
        if (index == 0) {
            dateEle.textContent = 'Today';
        } else {
            let currentDay = parse(data.days[index].datetime, "yyyy-MM-dd", new Date());
            let dayOfWeek = format(currentDay, 'EEEE');
            if (index > 6) {
                dateEle.textContent = `Next ${dayOfWeek}`;
            } else {
                dateEle.textContent = dayOfWeek;
            }
        }

        rainfallEle.textContent = `${Math.floor(data.days[index].precipprob)}%`

        let conditionEleSrc = parseConditionClass(data.days[index].conditions);
        console.log(conditionEleSrc);
        conditionEle.src = iconMap[conditionEleSrc];

        maxMinEle.textContent = `${Math.floor(data.days[index].tempmax)}\u00B0 / ${Math.floor(data.days[index].tempmin)}\u00B0`;
    })
}

const renderWeeklyRainfallInfo = function(data, units) {
    let rainfallDayEles = document.querySelectorAll('.rainfall-container .day');
    rainfallDayEles.forEach((day) => {
        // Select elements under each day
        let dateEle = day.querySelector('.date');
        let rainfallEle = day.querySelector('.rainfall-text');
        let index = day.dataset.index;

        // Set date to today
        if (index == 7) {
            dateEle.textContent = 'Today';
        } else if (index == 6) {
            dateEle.textContent = 'Yesterday';
        } else {
            let currentDate = parse(data.days[index].datetime, 'yyyy-MM-dd', new Date());
            let formattedDate = format(currentDate, 'MMM dd');
            dateEle.textContent = formattedDate;
        }

        // Give rainfall info
        rainfallEle.textContent = `${data.days[index].precip} ${units.rainfall}`
    })
}

export { renderData }