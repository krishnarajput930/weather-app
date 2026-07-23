const weatherIcons = {
    Clear: "assets/SUN.png",
    Clouds: "assets/CLOUD.png",
    Rain: "assets/rain.png",
    Drizzle: "assets/DRIZZLE.png",
    Thunderstorm: "assets/THUNDER.png",
    Snow: "assets/snow.png",
    Mist: "assets/MIST.png",
    Smoke: "assets/MIST.png",
    Haze: "assets/MIST.png",
    Dust: "assets/MIST.png",
    Fog: "assets/MIST.png",
    Sand: "assets/MIST.png",
    Ash: "assets/MIST.png",
    Squall: "assets/wind.png",
    Tornado: "assets/TORNADO.png",

};
const cityInput = document.getElementById("city-input");

const searchBtn = document.getElementById("search-btn");

const temperature = document.getElementById("temperature");

const cityName = document.getElementById("city-name");

const weatherStatus = document.getElementById("weather-status");

const humidity = document.getElementById("humidity-value");

const windSpeed = document.getElementById("wind-value");

const weatherIcon = document.getElementById("weather-icon");

const forecastContainer = document.getElementById("forecast-container");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("error-message");

const locationBtn = document.getElementById("location-btn");

const main = document.querySelector(".main");

const animationContainer =
    document.getElementById("weather-animation");

const sunriseTime = document.getElementById("sunrise-time");

const sunsetTime = document.getElementById("sunset-time");

const weatherTip = document.getElementById("weather-tip");
const dayNightIndicator =
    document.getElementById("day-night-indicator");
const apiKey = "93b1dc84d134457491b6093130675be4";

searchBtn.addEventListener("click", async () => {

    const city = cityInput.value.trim();

    if (city === "") {

        cityInput.classList.add("shake");

        setTimeout(() => {
            cityInput.classList.remove("shake");
        }, 400);

        return;
    }

    loading.classList.add("active");
    searchBtn.disabled = true;

    try {

        await Promise.all([
            getWeather(city),
            getForecast(city)
        ]);

    } finally {

        loading.classList.remove("active");
        searchBtn.disabled = false;

    }

});
locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        showError("Geolocation Not Supported");

        return;

    }

    loading.classList.add("active");

    navigator.geolocation.getCurrentPosition(

        successLocation,

        errorLocation

    );

});
cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});

function showError(message = "City Not Found") {

    const title = errorMessage.querySelector("h2");
    const text = errorMessage.querySelector("p");

    title.innerText = message;
    text.innerText = "Please enter a valid city name.";

    errorMessage.classList.add("active");

    setTimeout(() => {
        errorMessage.classList.remove("active");
    }, 2500);
}
function updateDayNight(sunrise, sunset) {

    const now = Math.floor(Date.now()/1000);

    if(now >= sunrise && now < sunset){

        dayNightIndicator.innerHTML = "☀️ Day";
        dayNightIndicator.style.background =
            "rgba(255,193,7,.25)";

    }else{

        dayNightIndicator.innerHTML = "🌙 Night";
        dayNightIndicator.style.background =
            "rgba(63,81,181,.25)";

    }

}
function updateWeatherTip(weather) {

    let tip = "";

    switch (weather) {

        case "Clear":
            tip = "😎 Wear sunglasses and stay hydrated.";
            break;

        case "Clouds":
            tip = "☁️ Pleasant weather for outdoor activities.";
            break;

        case "Rain":
        case "Drizzle":
            tip = "🌧️ Carry an umbrella before going out.";
            break;

        case "Thunderstorm":
            tip = "⛈️ Stay indoors and avoid open areas.";
            break;

        case "Snow":
            tip = "❄️ Wear warm clothes and drive carefully.";
            break;

        case "Mist":
        case "Fog":
            tip = "🌫️ Drive slowly due to low visibility.";
            break;

        default:
            tip = "🌤️ Have a wonderful day!";
    }

    weatherTip.innerText = tip;
}
function formatTime(unix) {

    const date = new Date(unix * 1000);

    return date.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

function changeBackground(weather) {

    main.classList.remove(
        "sunny",
        "cloudy",
        "rain",
        "thunder",
        "snow",
        "mist"
    );

    switch (weather) {

        case "Clear":
            main.classList.add("sunny");
            break;

        case "Clouds":
            main.classList.add("cloudy");
            break;

        case "Rain":
        case "Drizzle":
            main.classList.add("rain");
            break;

        case "Thunderstorm":
            main.classList.add("thunder");
            break;

        case "Snow":
            main.classList.add("snow");
            break;

        default:
            main.classList.add("mist");
    }

}
function createWeatherAnimation(weather) {

    animationContainer.innerHTML = "";

    if (weather === "Rain" || weather === "Drizzle") {

        for (let i = 0; i < 80; i++) {

            const drop = document.createElement("span");

            drop.className = "raindrop";

            drop.style.left = Math.random() * 100 + "%";

            drop.style.animationDuration =
                (0.7 + Math.random()) + "s";

            drop.style.animationDelay =
                Math.random() * 2 + "s";

            animationContainer.appendChild(drop);
        }

    }

    else if (weather === "Snow") {

        for (let i = 0; i < 40; i++) {

            const snow = document.createElement("span");

            snow.className = "snowflake";

            snow.innerHTML = "❄";

            snow.style.left = Math.random() * 100 + "%";

            snow.style.animationDuration =
                (4 + Math.random() * 4) + "s";

            snow.style.animationDelay =
                Math.random() * 5 + "s";

            animationContainer.appendChild(snow);

        }

    }

    else if (weather === "Clouds") {

        for (let i = 0; i < 6; i++) {

            const cloud = document.createElement("div");

            cloud.className = "cloud";

            cloud.innerHTML = "☁";

            cloud.style.top = (10 + i * 12) + "%";

            cloud.style.animationDuration =
                (20 + Math.random() * 15) + "s";

            cloud.style.animationDelay =
                Math.random() * 5 + "s";

            animationContainer.appendChild(cloud);

        }

    }

}
async function getWeather(city) {

   const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            showError("City Not Found");
            throw new Error("City not found");
        }

        const data = await response.json();
        temperature.innerText = `${Math.round(data.main.temp)}°C`;

        cityName.innerText = data.name;

        // Weather description
        const description = data.weather[0].description;

        weatherStatus.innerText =
            description.charAt(0).toUpperCase() + description.slice(1);

        humidity.innerText = `${data.main.humidity}%`;
        sunriseTime.innerText =
            formatTime(data.sys.sunrise);

        sunsetTime.innerText =
            formatTime(data.sys.sunset);
        updateDayNight(
            data.sys.sunrise,
            data.sys.sunset
        );


        windSpeed.innerText = `${Math.round(data.wind.speed * 3.6)} km/h`;
        const weatherMain = data.weather[0].main;
        updateWeatherTip(weatherMain);
        changeBackground(weatherMain);
        createWeatherAnimation(weatherMain);
        weatherIcon.src = weatherIcons[weatherMain] || "assets/CLOUD.png";
        cityInput.value = "";

    } catch (error) {

        console.error(error);

        if (error.message !== "City not found") {
            showError("Network Error");
        }

    }
}
async function getForecast(city) {
    forecastContainer.innerHTML = "";

    const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) return;

        const data = await response.json();


        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );


        let cards = "";

        dailyForecast.forEach((item, index) => {

            const date = new Date(item.dt_txt);

            const day = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            const temp = Math.round(item.main.temp);

            const weatherMain = item.weather[0].main;

            const description = item.weather[0].description;

            const forecastDescription =
                description.charAt(0).toUpperCase() + description.slice(1);

            const icon = weatherIcons[weatherMain] || "assets/CLOUD.png";

            cards += `
        <div class="forecast-card" style="animation-delay:${index * 0.15}s">
            <h3 class="day">${day}</h3>
            <img src="${icon}" class="forecast-image" alt="${forecastDescription}">
            <p class="forecast-status">${forecastDescription}</p>
            <h3 class="forecast-temperature">${temp}°C</h3>
        </div>
    `;
        });

        forecastContainer.innerHTML = cards;


    } catch (error) {

        console.log(error);

    }
}
function successLocation(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeatherByCoords(lat, lon);

}

function errorLocation() {

    loading.classList.remove("active");

    showError("Location Permission Denied");

}
async function getWeatherByCoords(lat, lon) {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {

        const response = await fetch(url);

        if (!response.ok) {
            showError("Unable to fetch location");
            return;
        }

        const data = await response.json();

        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        cityName.innerText = data.name;

        const description = data.weather[0].description;

        weatherStatus.innerText =
            description.charAt(0).toUpperCase() + description.slice(1);

        humidity.innerText = `${data.main.humidity}%`;
        sunriseTime.innerText =
            formatTime(data.sys.sunrise);

        sunsetTime.innerText =
            formatTime(data.sys.sunset);

        updateDayNight(
            data.sys.sunrise,
            data.sys.sunset
        );

        windSpeed.innerText =
            `${Math.round(data.wind.speed * 3.6)} km/h`;

        const weatherMain = data.weather[0].main;
        updateWeatherTip(weatherMain);


        changeBackground(weatherMain);
        createWeatherAnimation(weatherMain);
        weatherIcon.src =
            weatherIcons[weatherMain] || "assets/CLOUD.png";

        // Fetch forecast using the city name
        await getForecast(data.name);

        loading.classList.remove("active");

    } catch (error) {

        loading.classList.remove("active");
        console.log(error);

    }

}