<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
</head>
<body>

    <input type="text" id="cityInput" placeholder="Enter city name">
    <button id="searchBtn">Search Weather</button>

    <div id="location"></div>
    <div id="currentTemperature"></div>
    <div id="currentCondition"></div>
    <div id="currentHumidity"></div>
    <div id="currentWindSpeed"></div>
    <img id="currentWeatherIcon" alt="Weather icon">
    <div id="currentTime"></div>

    <div id="forecastDays"></div>

    <script>
        const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual OpenWeatherMap API key

        // Geolocate and set the default city
        function geolocateUser() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    reverseGeocode(lat, lon);
                }, function(error) {
                    console.error("Geolocation error:", error.message);
                    // Set a default city if geolocation fails
                    getWeatherData('Mongu'); // Default city
                });
            } else {
                // Geolocation not supported, use a default city
                getWeatherData('Mongu'); // Default city
            }
        }

        // Use reverse geocoding to get the city name from latitude and longitude
        function reverseGeocode(lat, lon) {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                .then(response => response.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village;
                    if (city) {
                        document.getElementById("cityInput").value = city;
                        getWeatherData(city);
                    } else {
                        console.error('City not found');
                        getWeatherData('Mongu'); // Default city
                    }
                })
                .catch(error => {
                    console.error("Reverse geocoding error:", error);
                    getWeatherData('Mongu'); // Default city
                });
        }

        // Fetch current weather data
        async function getWeatherData(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                displayCurrentWeather(data);
                getWeatherForecast(data.coord.lat, data.coord.lon);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }

        // Fetch weather forecast data
        async function getWeatherForecast(lat, lon) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                displayWeatherForecast(data);
            } catch (error) {
                console.error('Error fetching weather forecast:', error);
            }
        }

        // Display current weather data
        function displayCurrentWeather(data) {
            document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('currentTemperature').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('currentCondition').textContent = `Condition: ${data.weather[0].description}`;
            document.getElementById('currentHumidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('currentWindSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('currentWeatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            document.getElementById('currentTime').textContent = new Date().toLocaleString();

            setWeatherBackground(data.weather[0].main);
        }

        // Display weather forecast data
        function displayWeatherForecast(data) {
            const forecastDays = document.getElementById('forecastDays');
            forecastDays.innerHTML = '';

            for (let i = 0; i < data.list.length; i += 8) { 
                const dayData = data.list[i];
                const date = new Date(dayData.dt_txt).toLocaleDateString();
                const temperature = `Temp: ${dayData.main.temp}°C`;
                const condition = `Condition: ${dayData.weather[0].description}`;
                const iconUrl = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;

                const forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                forecastDay.innerHTML = `
                    <h3>${date}</h3>
                    <img src="${iconUrl}" alt="Weather icon">
                    <p>${temperature}</p>
                    <p>${condition}</p>
                `;
                forecastDays.appendChild(forecastDay);
            }
        }

        // Set dynamic background based on weather condition
        function setWeatherBackground(weatherMain) {
            const body = document.body;
            body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy');

            if (weatherMain === 'Clear') {
                body.classList.add('sunny');
            } else if (weatherMain === 'Clouds') {
                body.classList.add('cloudy');
            } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
                body.classList.add('rainy');
            } else if (weatherMain === 'Snow') {
                body.classList.add('snowy');
            }
        }

        // Event listener for manual city search
        document.getElementById('searchBtn').addEventListener('click', () => {
            const city = document.getElementById('cityInput').value;
            if (city) {
                getWeatherData(city);
            }
        });

        // Geolocate user on page load
        window.onload = function() {
            geolocateUser();
        };
    </script>

</body>
</html>
