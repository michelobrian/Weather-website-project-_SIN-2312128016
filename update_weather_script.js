document.getElementById("searchBtn").addEventListener("click", function() {         
    const city = document.getElementById("cityInput").value;         
    if (city) {             
        getWeatherData(city);         
    }     
});          

const apiKey = '5d67ecca30bfa52b4c8fd153e8c94584';

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

async function getWeatherForecast(lat, lon) {         
    try {             
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);             
        const data = await response.json();             
        displayWeatherForecast(data);         
    } catch (error) {             
        console.error('Error fetching weather forecast:', error);         
    }     
}           

function displayCurrentWeather(data) {         
    document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;         
    document.getElementById('currentTemperature').textContent = `Temperature: ${data.main.temp}°C`;         
    document.getElementById('currentCondition').textContent = `Condition: ${data.weather[0].description}`;         
    document.getElementById('currentHumidity').textContent = `Humidity: ${data.main.humidity}%`;         
    document.getElementById('currentWindSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;         
    document.getElementById('currentWeatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;         

    // Calculate local time for the city based on timezone offset
    const timezoneOffset = data.timezone; // offset in seconds
    const localTime = new Date(new Date().getTime() + timezoneOffset * 1000).toLocaleString();
    document.getElementById('currentTime').textContent = `Local Time: ${localTime}`;

    setWeatherBackground(data.weather[0].main);     
}               

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

document.getElementById('searchBtn').addEventListener('click', () => {         
    const city = document.getElementById('cityInput').value;         
    if (city) {             
        getWeatherData(city);         
    }     
});
