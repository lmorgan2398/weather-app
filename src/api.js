// Function to fetch and return weather data from API
const getWeatherData = async function(city, system){
    console.log(system);
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${system}&key=MNWL7XRQCYZZDAFFFELDZBUEK`);
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await response.json();
    return data;
}

export { getWeatherData }