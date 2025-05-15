// OpenWeatherMap API key and base URL
const API_KEY = '198cd181fab995f05b0d705991165dba';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const searchInput = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');
const errorDiv = document.querySelector('.error');
const weatherIcon = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temp');
const cityElement = document.querySelector('.city');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');

// Function to fetch weather data
async function fetchWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        console.log(data);
        updateDOM(data);
        errorDiv.style.display = 'none';
        localStorage.setItem('lastCity', city); // Save city to localStorage
    } catch (error) {
        errorDiv.style.display = 'block';
    }
}

// Function to update the DOM with weather data
function updateDOM(data) {
    const { name, main, weather, wind } = data;
    const isDay = weather[0].icon.includes('d'); // Check if it's day or night

    cityElement.textContent = name;
    tempElement.textContent = `${Math.round(main.temp)}°C`;
    humidityElement.textContent = `${main.humidity}%`;
    windElement.textContent = `${wind.speed} km/h`;

    // Update weather icon and background
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    document.body.style.backgroundImage = isDay
        ? "url('/lib/images/day.jpg')" 
        : "url('/lib/images/night.jpg')"; 
}

// Event listener for search button
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Event listener for pressing Enter
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

// Load last searched city from localStorage on page load
window.addEventListener('load', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        fetchWeather(lastCity);
    }
});