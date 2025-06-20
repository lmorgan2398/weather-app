// Function to fetch and return weather data from API
const getWeatherData = async function(city, system){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${system}&key=MNWL7XRQCYZZDAFFFELDZBUEK`);
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await response.json();
    return data;
}

const getIPData = async function() {
    const response = await fetch('https://iplocate.io/api/lookup/?apikey=6f10dfa2e3fe653c9be9c11f29d2e6e0');
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await(response.json());
    return data;
}

export { getWeatherData, getIPData }