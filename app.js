const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const feelsLike = document.querySelector("#feelsLike");
const wind = document.querySelector("#wind");
const weatherIcon = document.querySelector("#weatherIcon");
const error = document.querySelector("#error");
const date = document.querySelector("#date");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") {
        error.innerText = "Please enter a city name.";
        return;
    }
    error.innerText = "";
    try {
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("City not found");
        }
        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        cityName.innerText =
            `${location.name}, ${location.country}`;

        temperature.innerText =
            Math.round(current.temperature_2m);

        humidity.innerText =
            `${current.relative_humidity_2m}%`;

        feelsLike.innerText =
            `${Math.round(current.apparent_temperature)}°C`;

        wind.innerText =
            `${Math.round(current.wind_speed_10m)} km/h`;

        const weather = getWeatherCondition(
            current.weather_code
        );

        condition.innerText = weather.text;
        weatherIcon.innerText = weather.icon;

        date.innerText =
            `Updated: ${current.time.replace("T", " ")}`;

    }

    catch (err) {

        console.log(err);

        error.innerText =
            "Unable to find weather. Please check the city name.";

    }

}

function getWeatherCondition(code) {

    if (code === 0) {

        return {
            text: "Sunny",
            icon: "☀️"
        };
    }

    if (code >= 1 && code <= 3) {
        return {
            text: "Cloudy",
            icon: "☁️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            text: "Rainy",
            icon: "🌧️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rainy",
            icon: "🌧️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
      };
    }

    return {
        text: "Cloudy",
        icon: "☁️"
    };
}