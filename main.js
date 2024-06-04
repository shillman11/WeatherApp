const centerTempContent = document.querySelector(".center-temp-content");
const rightTempContent = document.querySelector(".right-temp-content");
const leftTempContent = document.querySelector(".left-temp-content");
const searchIcon = document.querySelector(".search-icon");
const searchText = document.querySelector(".search");
const feelsText = document.querySelector(".feels-text");
const humidityText = document.querySelector(".humidity-text");
const rainText = document.querySelector(".rain-text");
const windText = document.querySelector(".wind-text");
const dayCardContainer = document.querySelector("#day-cards-container");
const hourCardContainer = document.querySelector("#hour-cards-container");
const weekButton = document.querySelector("#weekly");
const hourButton = document.querySelector("#hourly");

let localTime,
  isDay,
  currentHumidity,
  currentC,
  currentF,
  feelsLikeC,
  feelsLikeF,
  currentWindKPH,
  currentWindMPH,
  currentSunrise,
  currentSunset,
  currentMoonPhase,
  currentChanceRain,
  maxTempC,
  maxTempF,
  minTempC,
  minTempF,
  currentCondition,
  locationName,
  hourWeather,
  dailyWeather,
  hour24,
  time;

GetWeather("san diego");

weekButton.addEventListener("click", (e) => {
  hourButton.className = "hour";
  weekButton.className = "day-active";
  hourCardContainer.className = "hour-cards-container-hidden";
  dayCardContainer.className = "day-cards-container-active";
});

hourButton.addEventListener("click", (e) => {
  hourButton.className = "hour-active";
  weekButton.className = "day";
  hourCardContainer.className = "hour-cards-container-active";
  dayCardContainer.className = "day-cards-container-hidden";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let location = searchText.value;
    searchText.value = "";
    GetWeather(location);
  }
});

searchIcon.addEventListener("click", () => {
  let location = searchText.value;
  searchText.value = "";
  GetWeather(location);
});

async function GetWeather(location) {
  let weather;
  let fetchURL =
    "http://api.weatherapi.com/v1/forecast.json?key=a09befba5cab486db4d00339231810&q=" +
    location +
    "&days=4";

  const weatherData = await fetch(fetchURL, { mode: "cors" });
  weather = await weatherData.json();

  console.log(weather);
  if (weather.error) {
    alert("Location was not found");
  }

  //location
  locationName = weather.location.name;
  localTime = weather.location.localtime;
  isDay = weather.current.is_day;

  //cutrrent weather data
  currentCondition = weather.current.condition.text;
  currentHumidity = weather.current.humidity;
  currentC = weather.current.temp_c;
  currentF = weather.current.temp_f;
  feelsLikeC = weather.current.feelslike_c;
  feelsLikeF = weather.current.feelslike_f;
  currentWindKPH = weather.current.wind_kph;
  currentWindMPH = weather.current.wind_mph;
  currentSunrise = weather.forecast.forecastday[0].astro.sunrise;
  currentSunset = weather.forecast.forecastday[0].astro.sunset;
  currentMoonPhase = weather.forecast.forecastday[0].astro.moon_phase;
  currentChanceRain = weather.forecast.forecastday[0].day.daily_chance_of_rain;
  maxTempC = weather.forecast.forecastday[0].day.maxtemp_c;
  maxTempF = weather.forecast.forecastday[0].day.maxtemp_f;
  minTempC = weather.forecast.forecastday[0].day.mintemp_c;
  minTempF = weather.forecast.forecastday[0].day.mintemp_f;

  //hourly weather
  hourWeather = [];

  for (let i = 0; i < 24; i++) {
    hourWeather[i] = [];

    time = new Date(weather.forecast.forecastday[0].hour[i].time);

    hour24 = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: "true",
    }).format(time);

    hourWeather[i].push(
      //condition [x][0]
      weather.forecast.forecastday[0].hour[i].condition.text
    );

    hourWeather[i].push(
      //is day [x][1]
      weather.forecast.forecastday[0].hour[i].is_day
    );

    hourWeather[i].push(
      //hour [x][2]
      hour24
    );

    //tempF [x][3]
    hourWeather[i].push(weather.forecast.forecastday[0].hour[i].temp_f);

    //tempC [x][4]
    hourWeather[i].push(weather.forecast.forecastday[0].hour[i].temp_c);
  }

  //daily weather
  dailyWeather = [];

  for (let i = 0; i < 3; i++) {
    dailyWeather[i] = [];
    //date [x][0]

    let dayDate = weather.forecast.forecastday[i].date;

    let date = new Date(dayDate);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let dayIndex = date.getDay();

    let dayName = daysOfWeek[dayIndex + 1];

    dailyWeather[i].push(dayName);

    dailyWeather[i].push(
      //condition [x][1]
      weather.forecast.forecastday[i].day.condition.text
    );

    dailyWeather[i].push(
      //chance of rain [x][2]
      weather.forecast.forecastday[i].day.daily_chance_of_rain
    );

    dailyWeather[i].push(
      //minC [x][3]
      Math.floor(weather.forecast.forecastday[i].day.mintemp_c)
    );

    dailyWeather[i].push(
      //minF [x][4]
      Math.floor(weather.forecast.forecastday[i].day.mintemp_f)
    );

    dailyWeather[i].push(
      //MaxC [x][5]
      Math.floor(weather.forecast.forecastday[i].day.maxtemp_c)
    );

    dailyWeather[i].push(
      //maxF [x][6]
      Math.floor(weather.forecast.forecastday[i].day.maxtemp_f)
    );
  }

  updateDOM();
}

function getIcon(isday, conditionText) {
  const iconMap = {
    1: {
      Sunny: "./Assets/svg/clear-day",
      "Partly cloudy": "./Assets/svg/partly-cloudy-day",
      Cloudy: "./Assets/svg/cloudy",
      "Cloudy ": "./Assets/svg/cloudy",
      Overcast: "./Assets/svg/overcast-day",
      "Overcast ": "./Assets/svg/overcast-day",
      "Partly Cloudy ": "./Assets/svg/overcast-day",
      Mist: "./Assets/svg/mist",
      "Patchy rain possible": "./Assets/svg/partly-cloudy-day-rain",
      "Patchy rain nearby": "./Assets/svg/partly-cloudy-day-rain",
      "Patchy snow possible": "./Assets/svg/partly-cloudy-day-snow",
      "Patchy sleet possible": "./Assets/svg/partly-cloudy-day-sleet",
      "Patchy freezing drizzle possible": "./Assets/svg/partly-cloudy-day-hail",
      "Thundery outbreaks possible": "./Assets/svg/thunderstorms-day-overcast",
      "Blowing snow": "./Assets/svg/wind-snow",
      Blizzard: "./Assets/svg/wind-snow",
      Fog: "./Assets/svg/fog",
      "Freezing fog": "./Assets/svg/fog",
      "Patchy light drizzle": "./Assets/svg/partly-cloudy-day-rain",
      "Light drizzle": "./Assets/svg/overcast-day-rain",
      "Freezing drizzle": "./Assets/svg/overcast-hail",
      "Heavy freezing drizzle": "./Assets/svg/extreme-day-hail",
      "Patchy light rain": "./Assets/svg/partly-cloudy-day-rain",
      "Light rain": "./Assets/svg/partly-cloudy-day-rain",
      "Moderate rain at times": "./Assets/svg/rain",
      "Moderate rain": "./Assets/svg/rain",
      "Heavy rain at times": "./Assets/svg/extreme-day-rain",
      "Heavy rain": "./Assets/svg/extreme-rain",
      "Light freezing rain": "./Assets/svg/overcast-day-hail",
      "Moderate or heavy freezing rain": "./Assets/svg/extreme-hail",
      "Light sleet": "./Assets/svg/partly-cloudy-day-sleet",
      "Moderate or heavy sleet": "./Assets/svg/extreme-sleet",
      "Patchy light snow": "./Assets/svg/partly-cloudy-day-snow",
      "light snow": "./Assets/svg/partly-cloudy-day-snow",
      "Patchy moderate snow": "./Assets/svg/overcast-day-snow",
      "moderate snow": "./Assets/svg/overcast-day-snow",
      "Patchy heavy snow": "./Assets/svg/extreme-snow",
      "heavy snow": "./Assets/svg/extreme-snow",
      "Ice pellets": "./Assets/svg/hail",
      "Light rain shower": "./Assets/svg/drizzle",
      "Moderate or heavy rain shower": "./Assets/svg/overcast-drizzle",
      "Torrential rain shower": "./Assets/svg/extreme-drizzle",
      "Light sleet showers": "./Assets/svg/partly-cloudy-day-sleet",
      "Moderate or heavy sleet showers": "./Assets/svg/extreme-sleet",
      "Light snow showers": "./Assets/svg/partly-cloudy-day-snow",
      "Moderate or heavy snow showers": "./Assets/svg/extreme-snow",
      "Light showers of ice pellets": "./Assets/svg/partly-cloudy-day-hail",
      "Moderate or heavy showers of ice pellets": "./Assets/svg/extreme-hail",
      "Patchy light rain with thunder":
        "./Assets/svg/thunderstorms-day-overcast-rain",
      "Moderate or heavy rain with thunder":
        "./Assets/svg/thunderstorms-extreme",
      "Patchy light snow with thunder": "./Assets/svg/thunderstorms-day-snow",
      "Moderate or heavy snow with thunder":
        "./Assets/svg/thunderstorms-extreme-snow",
    },
    0: {
      Clear: "./Assets/svg/clear-night",
      "Clear ": "./Assets/svg/clear-night",
      "Partly cloudy": "./Assets/svg/partly-cloudy-night",
      Cloudy: "./Assets/svg/cloudy",
      Overcast: "./Assets/svg/overcast-night",
      "Partly Cloudy ": "./Assets/svg/overcast-night",
      Mist: "./Assets/svg/mist",
      "Patchy rain possible": "./Assets/svg/partly-cloudy-night-rain",
      "Patchy rain nearby": "./Assets/svg/partly-cloudy-night-rain",
      "Patchy snow possible": "./Assets/svg/partly-cloudy-night-snow",
      "Patchy sleet possible": "./Assets/svg/partly-cloudy-night-sleet",
      "Patchy freezing drizzle possible":
        "./Assets/svg/partly-cloudy-night-hail",
      "Thundery outbreaks possible":
        "./Assets/svg/thunderstorms-night-overcast",
      "Blowing snow": "./Assets/svg/wind-snow",
      Fog: "./Assets/svg/fog",
      "Freezing fog": "./Assets/svg/fog",
      "Patchy light drizzle": "./Assets/svg/partly-cloudy-night-rain",
      "Light drizzle": "./Assets/svg/overcast-night-rain",
      "Freezing drizzle": "./Assets/svg/overcast-hail",
      "Heavy freezing drizzle": "./Assets/svg/extreme-night-hail",
      "Patchy light rain": "./Assets/svg/partly-cloudy-night-rain",
      "Light rain": "./Assets/svg/partly-cloudy-night-rain",
      "Moderate rain at times": "./Assets/svg/rain",
      "Moderate rain": "./Assets/svg/rain",
      "Heavy rain at times": "./Assets/svg/extreme-night-rain",
      "Heavy rain": "./Assets/svg/extreme-rain",
      "Light freezing rain": "./Assets/svg/overcast-night-hail",
      "Moderate or heavy freezing rain": "./Assets/svg/extreme-hail",
      "Light sleet": "./Assets/svg/partly-cloudy-night-sleet",
      "Moderate or heavy sleet": "./Assets/svg/extreme-sleet",
      "Patchy light snow": "./Assets/svg/partly-cloudy-night-snow",
      "light snow": "./Assets/svg/partly-cloudy-night-snow",
      "Patchy moderate snow": "./Assets/svg/overcast-night-snow",
      "moderate snow": "./Assets/svg/overcast-night-snow",
      "Patchy heavy snow": "./Assets/svg/extreme-snow",
      "heavy snow": "./Assets/svg/extreme-snow",
      "Ice pellets": "./Assets/svg/hail",
      "Light rain shower": "./Assets/svg/drizzle",
      "Moderate or heavy rain shower": "./Assets/svg/overcast-drizzle",
      "Torrential rain shower": "./Assets/svg/extreme-drizzle",
      "Light sleet showers": "./Assets/svg/partly-cloudy-night-sleet",
      "Moderate or heavy sleet showers": "./Assets/svg/extreme-sleet",
      "Light snow showers": "./Assets/svg/partly-cloudy-night-snow",
      "Moderate or heavy snow showers": "./Assets/svg/extreme-snow",
      "Light showers of ice pellets": "./Assets/svg/partly-cloudy-night-hail",
      "Moderate or heavy showers of ice pellets": "./Assets/svg/extreme-hail",
      "Patchy light rain with thunder":
        "./Assets/svg/thunderstorms-night-overcast-rain",
      "Moderate or heavy rain with thunder":
        "./Assets/svg/thunderstorms-extreme",
      "Patchy light snow with thunder": "./Assets/svg/thunderstorms-night-snow",
      "Moderate or heavy snow with thunder":
        "./Assets/svg/thunderstorms-extreme-snow",
    },
  };

  return iconMap[isday][conditionText];
}

function updateDOM() {
  //clear dom

  clearDOM();

  //update dom in F

  // current condition icon
  const contentConditionIcon = document.createElement("img");
  contentConditionIcon.className = "content-icon";
  contentConditionIcon.id = "current-condition-icon";
  console.log(isDay, currentCondition);
  contentConditionIcon.src = getIcon(isDay, currentCondition) + ".svg";
  centerTempContent.appendChild(contentConditionIcon);

  // current condition
  const contentCondition = document.createElement("div");
  contentCondition.className = "content";
  contentCondition.id = "condition";
  contentCondition.innerHTML = currentCondition;
  centerTempContent.appendChild(contentCondition);

  //location name
  const contentLocationName = document.createElement("div");
  contentLocationName.className = "content";
  contentLocationName.id = "location";
  contentLocationName.innerHTML = locationName;
  leftTempContent.appendChild(contentLocationName);

  // current Time
  const contentTime = document.createElement("div");
  contentTime.className = "content";
  contentTime.id = "local-time";
  const fixedLocalTime = new Date(localTime);

  const formattedLocalTime = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: "true",
  }).format(fixedLocalTime);

  contentTime.innerHTML = formattedLocalTime;
  leftTempContent.appendChild(contentTime);

  //current Temperature F
  const contentTempF = document.createElement("div");
  contentTempF.className = "content";
  contentTempF.id = "tempf";
  contentTempF.innerHTML = Math.floor(parseFloat(currentF)) + " &deg;F";
  centerTempContent.appendChild(contentTempF);

  //feels like temperature F
  const contentFeelTempF = document.createElement("div");
  contentFeelTempF.className = "content";
  contentFeelTempF.id = "feeltempf";
  contentFeelTempF.innerHTML = Math.floor(parseFloat(feelsLikeF)) + " &deg;F";
  feelsText.appendChild(contentFeelTempF);

  //humidity
  const contentHumidity = document.createElement("div");
  contentHumidity.className = "content";
  contentHumidity.id = "humidity";
  contentHumidity.innerHTML = Math.floor(parseFloat(currentHumidity)) + "%";
  humidityText.appendChild(contentHumidity);

  //chance of rain
  const contentrain = document.createElement("div");
  contentrain.className = "content";
  contentrain.id = "rain";
  contentrain.innerHTML = Math.floor(parseFloat(currentChanceRain)) + "%";
  rainText.appendChild(contentrain);

  //wind speed MPH
  const contentWind = document.createElement("div");
  contentWind.className = "content";
  contentWind.id = "wind";
  contentWind.innerHTML = Math.floor(parseFloat(currentWindMPH)) + " mph";
  windText.appendChild(contentWind);

  //daily cards

  console.log(dailyWeather);

  //day card 1
  const cardDayContainer1 = document.createElement("div");
  cardDayContainer1.className = "card-container";
  cardDayContainer1.id = "day1";
  dayCardContainer.appendChild(cardDayContainer1);

  //day1 name
  const cardDay1 = document.createElement("div");
  cardDay1.className = "day-card-day";
  cardDay1.id = "today";
  cardDay1.innerHTML = dailyWeather[0][0];
  cardDayContainer1.appendChild(cardDay1);

  //day1 logo
  const cardDay1Logo = document.createElement("img");
  cardDay1Logo.className = "day-card-logo";
  cardDay1Logo.id = "daylogo1";
  cardDay1Logo.src = getIcon(1, dailyWeather[0][1]) + ".svg";
  cardDayContainer1.appendChild(cardDay1Logo);

  //day1 highF
  const cardDay1HighF = document.createElement("div");
  cardDay1HighF.className = "day-card-temp";
  cardDay1HighF.id = "highF";
  cardDay1HighF.innerHTML = dailyWeather[0][6] + " F";
  cardDayContainer1.appendChild(cardDay1HighF);

  //day1 lowF
  const cardDay1lowF = document.createElement("div");
  cardDay1lowF.className = "day-card-temp-low";
  cardDay1lowF.id = "lowF";
  cardDay1lowF.innerHTML = dailyWeather[0][4] + " F";
  cardDayContainer1.appendChild(cardDay1lowF);

  //day2

  //day card 2
  const cardDayContainer2 = document.createElement("div");
  cardDayContainer2.className = "card-container";
  cardDayContainer2.id = "day2";
  dayCardContainer.appendChild(cardDayContainer2);

  //day2 name

  const cardDay2 = document.createElement("div");
  cardDay2.className = "day-card-day";
  cardDay2.id = "tommorow";
  cardDay2.innerHTML = dailyWeather[1][0];
  cardDayContainer2.appendChild(cardDay2);

  //day2 logo
  const cardDay2Logo = document.createElement("img");
  cardDay2Logo.className = "day-card-logo";
  cardDay2Logo.id = "daylogo2";
  cardDay2Logo.src = getIcon(1, dailyWeather[1][1]) + ".svg";
  cardDayContainer2.appendChild(cardDay2Logo);

  //day2 highF
  const cardDay2HighF = document.createElement("div");
  cardDay2HighF.className = "day-card-temp";
  cardDay2HighF.id = "highF2";
  cardDay2HighF.innerHTML = dailyWeather[1][6] + " F";
  cardDayContainer2.appendChild(cardDay2HighF);

  //day2 lowF
  const cardDay2lowF = document.createElement("div");
  cardDay2lowF.className = "day-card-temp-low";
  cardDay2lowF.id = "lowF2";
  cardDay2lowF.innerHTML = dailyWeather[1][4] + " F";
  cardDayContainer2.appendChild(cardDay2lowF);

  //day3

  //day card 3
  const cardDayContainer3 = document.createElement("div");
  cardDayContainer3.className = "card-container";
  cardDayContainer3.id = "day3";
  dayCardContainer.appendChild(cardDayContainer3);

  //day3 name
  const cardDay3 = document.createElement("div");
  cardDay3.className = "day-card-day";
  cardDay3.id = "tommorow2";
  cardDay3.innerHTML = dailyWeather[2][0];
  cardDayContainer3.appendChild(cardDay3);

  //day3 logo
  const cardDay3Logo = document.createElement("img");
  cardDay3Logo.className = "day-card-logo";
  cardDay3Logo.id = "daylogo3";
  cardDay3Logo.src = getIcon(1, dailyWeather[2][1]) + ".svg";
  cardDayContainer3.appendChild(cardDay3Logo);

  //day3 highF
  const cardDay3HighF = document.createElement("div");
  cardDay3HighF.className = "day-card-temp-high";
  cardDay3HighF.id = "highF3";
  cardDay3HighF.innerHTML = dailyWeather[2][6] + " F";
  cardDayContainer3.appendChild(cardDay3HighF);

  //day3 lowF
  const cardDay3lowF = document.createElement("div");
  cardDay3lowF.className = "day-card-temp-low";
  cardDay3lowF.id = "lowF3";
  cardDay3lowF.innerHTML = dailyWeather[2][4] + " F";
  cardDayContainer3.appendChild(cardDay3lowF);

  //taking the hour of the day and listing the hours after

  const fixedLocalHour = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
  }).format(fixedLocalTime);

  for (let i = parseInt(fixedLocalHour) + 1; i < 24; i++) {
    //hour card container
    const hourCard = document.createElement("div");
    hourCard.className = "card-hour-container";
    hourCard.id = "hour-card " + i;
    hourCardContainer.appendChild(hourCard);

    //create hour card text
    const cardHour = document.createElement("div");
    cardHour.className = "card-hour-text";
    cardHour.id = "hour " + i;
    cardHour.innerHTML = hourWeather[i][2];
    hourCard.appendChild(cardHour);

    //create hour card tempF
    const hourCardTempF = document.createElement("div");
    hourCardTempF.className = "card-hour-temp-f";
    hourCardTempF.id = "hour-temp-f " + i;
    hourCardTempF.innerHTML = Math.floor(hourWeather[i][3]) + " F";
    hourCard.appendChild(hourCardTempF);

    //create hour card logo
    const hourCardLogo = document.createElement("img");
    hourCardLogo.className = "hour-card-logo";
    hourCardLogo.id = "hour-card-logo" + i;
    hourCardLogo.src = getIcon(hourWeather[i][1], hourWeather[i][0]) + ".svg";
    hourCard.appendChild(hourCardLogo);
  }
}

function clearDOM() {
  while (centerTempContent.firstChild) {
    centerTempContent.removeChild(centerTempContent.firstChild);
  }

  while (leftTempContent.firstChild) {
    leftTempContent.removeChild(leftTempContent.firstChild);
  }

  while (feelsText.firstChild) {
    feelsText.removeChild(feelsText.firstChild);
  }

  while (humidityText.firstChild) {
    humidityText.removeChild(humidityText.firstChild);
  }

  while (rainText.firstChild) {
    rainText.removeChild(rainText.firstChild);
  }

  while (windText.firstChild) {
    windText.removeChild(windText.firstChild);
  }

  while (dayCardContainer.firstChild) {
    dayCardContainer.removeChild(dayCardContainer.firstChild);
  }

  while (hourCardContainer.firstChild) {
    hourCardContainer.removeChild(hourCardContainer.firstChild);
  }
}
