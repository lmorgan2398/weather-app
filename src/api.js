import { format } from 'date-fns-tz';

// Function to fetch and return weather data from API
const getWeatherData = async function(city, system){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${system}&key=MNWL7XRQCYZZDAFFFELDZBUEK`);
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await response.json();
    console.log(data);
    return data;
}

const getRainfallData = async function(city, system){
    let now = new Date();
    let sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    console.log(sevenDaysAgo);

    let formattedNow = format(now, 'yyyy-MM-dd');
    let formattedSevenDaysAgo = format(sevenDaysAgo, 'yyyy-MM-dd');

    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${formattedSevenDaysAgo}/${formattedNow}?unitGroup=${system}&include=days&elements=datetime,precip&key=MNWL7XRQCYZZDAFFFELDZBUEK&contentType=json`);
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await response.json();
    console.log(data);
    return data;
}

const getIPData = async function() {
    const response = await fetch('https://iplocate.io/api/lookup/?apikey=6f10dfa2e3fe653c9be9c11f29d2e6e0');
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await(response.json());
    return data;
}

export { getWeatherData, getIPData, getRainfallData }