
document.getElementById("searchBtn").addEventListener("click", function() {
    const city = document.getElementById("cityInput").value;
    if (city) {
        getWeatherData(city);
    }
});

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
            document.getElementById("cityInput").value = "New York"; // You can change this to a default city
            getWeatherData("New York");
        });
    } else {
        // Geolocation not supported, use a default city
        document.getElementById("cityInput").value = "New York"; // Default city
        getWeatherData("New York");
    }
}

// Use a reverse geocoding API to get city name from latitude and longitude
function reverseGeocode(lat, lon) {
    // Example using a free reverse geocoding service (OpenStreetMap's Nominatim)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data && data.address && data.address.city) {
                const city = data.address.city;
                document.getElementById("cityInput").value = city;
                getWeatherData(city);
            } else {
                console.error("City not found");
                // Use a default city if the city is not found
                document.getElementById("cityInput").value = "New York";
                getWeatherData("New York");
            }
        })
        .catch(error => {
            console.error("Reverse geocoding error:", error);
            // Use a default city on error
            document.getElementById("cityInput").value = "New York";
            getWeatherData("New York");
        });
}

// Dummy function to simulate fetching weather data
function getWeatherData(city) {
    console.log(`Fetching weather data for ${city}`);
    // Implement your actual weather API logic here
}

// Call geolocation function on page load
window.onload = function() {
    geolocateUser();
};

