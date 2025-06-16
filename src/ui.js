import { parse } from 'date-fns';
import { format } from 'date-fns-tz';

const renderData = function(data) {
    renderOverview(data);
    
}

const renderOverview = function(data) {
    const overviewEle = document.querySelector('.overview');
    const locationEle = document.querySelector('.overview .location');
    const timeEle = document.querySelector('.overview .time');
    const temperatureEle = document.querySelector('.overview .temperature');
    const weatherEle = document.querySelector('.overview .weather');
    const dayNightEle = document.querySelector('.overview .day-night');

    locationEle.textContent = `${data.resolvedAddress}`;

    let timeZone = data.timezone;
    let currentTime = parse(data.currentConditions.datetime, 'HH:mm:ss', new Date());
    let formattedTime = format(currentTime, 'h:mm aa zzz', { timeZone });
    timeEle.textContent = `As of ${formattedTime}`;

    temperatureEle.textContent = `${Math.floor(data.currentConditions.temp)}\u00B0F`;

    weatherEle.textContent = `${data.currentConditions.conditions}`;

    dayNightEle.textContent = `High ${Math.floor(data.days[0].tempmax)}\u00B0F \u2022 Low ${Math.floor(data.days[0].tempmin)}\u00B0F`;
}

export { renderData }