// ===============================
// OpenWeather API Key
// ===============================

const apiKey = "edfb62f318d090532302582cff228924";

// ===============================
// DOM Elements
// ===============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherBox = document.getElementById("weatherBox");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");

const temperature = document.getElementById("temperature");
const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const weatherIcon = document.getElementById("weatherIcon");

const date = document.getElementById("date");
const time = document.getElementById("time");

const historyList = document.getElementById("historyList");

const themeBtn = document.getElementById("themeBtn");

// ===============================
// Search Button
// ===============================

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city !== ""){
        getWeather(city);
    }

});

// ===============================
// Press Enter
// ===============================

cityInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});

// ===============================
// Fetch Weather
// ===============================

async function getWeather(city){

    loader.classList.remove("hidden");
    weatherBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if(!response.ok){

            throw new Error("City not found");

        }

        const data = await response.json();

        displayWeather(data);

        saveHistory(city);

    }

    catch(error){

        errorBox.classList.remove("hidden");

    }

    finally{

        loader.classList.add("hidden");

    }

}

// ===============================
// Display Weather
// ===============================

function displayWeather(data){

    weatherBox.classList.remove("hidden");

    temperature.textContent =
    `${Math.round(data.main.temp)}°C`;

    cityName.textContent =
    data.name;

    weatherDescription.textContent =
    data.weather[0].description;

    feelsLike.textContent =
    `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
    `${data.main.humidity}%`;

    wind.textContent =
    `${data.wind.speed} km/h`;

    pressure.textContent =
    `${data.main.pressure} hPa`;

    weatherIcon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    updateBackground(data.weather[0].main);

}

// ===============================
// Background Change
// ===============================

function updateBackground(weather){

    weather = weather.toLowerCase();

    if(weather.includes("clear")){

        document.body.style.background =
        "linear-gradient(135deg,#56CCF2,#2F80ED)";

    }

    else if(weather.includes("cloud")){

        document.body.style.background =
        "linear-gradient(135deg,#757F9A,#D7DDE8)";

    }

    else if(weather.includes("rain")){

        document.body.style.background =
        "linear-gradient(135deg,#314755,#26A0DA)";

    }

    else if(weather.includes("snow")){

        document.body.style.background =
        "linear-gradient(135deg,#E6DADA,#274046)";

    }

    else{

        document.body.style.background =
        "linear-gradient(135deg,#4facfe,#00f2fe)";

    }

}

// ===============================
// Date & Time
// ===============================

function updateDateTime(){

    const now = new Date();

    date.textContent =
    now.toDateString();

    time.textContent =
    now.toLocaleTimeString();

}

setInterval(updateDateTime,1000);

updateDateTime();

// ===============================
// Local Storage
// ===============================

function saveHistory(city){

    let history =
    JSON.parse(localStorage.getItem("history")) || [];

    if(!history.includes(city)){

        history.unshift(city);

    }

    history = history.slice(0,5);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();

}

// ===============================
// Display History
// ===============================

function displayHistory(){

    historyList.innerHTML="";

    const history =
    JSON.parse(localStorage.getItem("history")) || [];

    history.forEach(city=>{

        const li =
        document.createElement("li");

        li.textContent=city;

        li.addEventListener("click",()=>{

            cityInput.value=city;

            getWeather(city);

        });

        historyList.appendChild(li);

    });

}

displayHistory();

// ===============================
// Dark Mode
// ===============================

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

});