
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const getWeather = async (lat: number, lon: number) => {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}

const getForecast = async (lat: number, lon: number) => {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}

const getImage = async (condition: string) => {
    const response = await fetch(`https://openweathermap.org/img/wn/${condition}@2x.png`);
    const data = await response.json();
    return data;
}

// const searchLocations = async (query: string) => {
//     const response = await fetch(`${BASE_URL}/weather?q=${query}&appid=${API_KEY}`);
//     const data = await response.json();
//     return data;
// }

export { getWeather, getForecast, getImage };




