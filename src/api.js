// Function to fetch and return weather data from API
const getWeatherData = async function(city){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=MNWL7XRQCYZZDAFFFELDZBUEK`);
    if (!response.ok) throw new Error('Failed to fetch');
    let data = await response.json();
    console.log(data);
    return data;
}

export { getWeatherData }