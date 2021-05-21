// from the API we need the city id/name, zip code, and geo coordinates
// first we need to check whether the geolocation services are available in their location
    // if the users navigator has geolocation services
    // In their navigator, use the getcurrentposition method and call the showerror and setposition functions

    // but if their geo.ocation serbices are not available, show this notificaiton to the user.
    // but wont be able to see this notif bc the display is default none, so change css to block
 
// After that we are going to use the method, getCurrentPosition() which takes in setPosition, and setPosiition takes in one argument called position, 
// Position is the object the method is going to change the properties of, the lat and long 
// Error() takes in one argument called error, which is an object, and its properties are the id of the error and the error message



// We need a provider for the weather info (weather app) - make an account
// we need send a request to the api and when we get the response, handle the response

// SELECT ELEMENTS
// notice we are selectionf the paragraphs of some of these elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p"); 
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {}; // creating our weather object {curly brackets mean object}

weather.temperature = { //creating another object
    unit: "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273; // will help with converting later
// API KEY
const key = "ec7289642d80e62c35b91853ce9a89d7";

// CHECK IF BROWSER SUPPORTS GEOLOCATION SERVICES
if("geolocation" in navigator){ // The navigator OBJECT contains information about the browser.
    navigator.geolocation.getCurrentPosition(setPosition,showError); //he Geolocation.getCurrentPosition() method (function that deals with object properties) is used to get the current position of the device with parameters showError and setPosition (which are functions we will create below).
}else{ //Show an error msg to the user if the geo services are NOT available (different than if there is geo services but there is an error)
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser Doesnt Support Geolocation.</p>";
}


// SET USER'S POSITION
    function setPosition(position){
        let latitude = position.coords.latitude; //comes from api's object properties
        let longitude = position.coords.longitude;

        // getWeather()function defined lower on this js page, which will get the weather from the api provider
        getWeather(latitude, longitude);

    }
// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEO SERVICES
    function showError(error){
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `<p> ${error.message} </p>"`; // will display the error message of the object
    }


// GET WEATHER FROM API PROVIDER
function getWeather(latitude,longitude){
    // ?? I guess we are defining the api
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    // console.log(api); - >use this to test whether api is working
     
    // using fetch to grab thte data
    fetch(api)
        .then(function(response){     // we get a response and make it a function
            let data = response.json();  // we pass that response
            return data;  // data becomes an object with many properties
    })
    .then(function(data){
        // inside the function data we will update our weather object properties
        // for the value of the temp we need to change it to celsius and use Math.floor to make sure it is an integer
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        // then we will grab the other values we need from the data object and pass them through out browser
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    // now after updating the info of the weather object we created, we can now display the weather to the user using the display weather function which is defined farther below
    .then(function(){
        displayWeather();
    });
}

// DISPLAY WEATHER to the UI
function displayWeather(){
    // adding in the info we created above to inner html - for the icon all the images have img src and .png which is why we made it this way
    iconElement.innerHTML = `<img src = "icons/${weather.iconId}.png"/>`
    tempElement.innerHTML = `${weather.temperature.value}&#176<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion 
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}
// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENT
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit === "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}&#176<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}&#176<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});

