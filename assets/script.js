var recentCities = [];
var cityname;
listRecentCities();
initWeather();

function renderCities() {
  $("#recentCities").empty();
  $("#currentSearch").val("");

  for (i = 0; i < recentCities.length; i++) {
    var listGroup = $("<listGroup>");
    listGroup.addClass(
      "list-group-item list-group-item-action list-group-item-primary city"
    );
    listGroup.attr("data-name", recentCities[i]);
    listGroup.text(recentCities[i]);
    $("#recentCities").prepend(listGroup);
  }
}

function listRecentCities() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  if (storedCities !== null) {
    recentCities = storedCities;
  }

  renderCities();
}
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));
    if (storedWeather !== null) {
      cityname = storedWeather;
  
      displayCurrentWeather();
      displayFiveDayForecast();
    }
  }

  function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(recentCities));
  }

  function storeCurrentCity() {
    localStorage.setItem("currentCity", JSON.stringify(cityname));
  }

  $("#searchCityBtn").on("click", function (event) {
    event.preventDefault();
  
    cityname = $("#currentSearch").val().trim();
    if (cityname === "") {
      alert("Please enter a city to check the weather");
    } else if (recentCities.length >= 5) {
      recentCities.shift();
      recentCities.push(cityname);
    } else {
      recentCities.push(cityname);
    }
    storeCurrentCity();
    storeCityArray();
    renderCities();
    displayCurrentWeather();
    displayFiveDayForecast();
  });
  
  $("#currentSearch").keypress(function (e) {
    if (e.which == 13) {
      $("#searchCityBtn").click();
    }
  });
  
  async function displayCurrentWeather() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityname +
      "&units=imperial&appid=4a86248e5662161bd621dea2224441f4";
  
    var response = await $.ajax({
      url: queryURL,
      method: "GET",
    });
    console.log(response);
  
    var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
    var currentWeatherHeader = $("<h5 class='card-header border-secondary'>").text(
    "Current Weather"
    );
    currentWeatherDiv.append(currentWeatherHeader);
    var getCurrentCity = response.name;
    var date = new Date();
    var val =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    var getCurrentWeatherIcon = response.weather[0].icon;
    var displayCurrentWeatherIcon = $(
      "<img src = http://openweathermap.org/img/wn/" +
        getCurrentWeatherIcon +
        "@2x.png />"
    );
    var currentCityElement = $("<h3 class = 'card-body'>").text(
      getCurrentCity + " (" + val + ")"
    );
    currentCityElement.append(displayCurrentWeatherIcon);
    currentWeatherDiv.append(currentCityElement);
    var getTemperature = response.main.temp.toFixed(1);
    var temperature = $("<p class='card-text'>").text(
      "Temperature: " + getTemperature + "° F"
    );
    currentWeatherDiv.append(temperature);
    var getHumidity = response.main.humidity;
    var humidityPercent = $("<p class='card-text'>").text(
      "Humidity: " + getHumidity + "%"
    );
    currentWeatherDiv.append(humidityPercent);
    var getWindSpeed = response.wind.speed.toFixed(1);
    var windSpeed = $("<p class='card-text'>").text(
      "Wind Speed: " + getWindSpeed + "mph"
    );
    currentWeatherDiv.append(windSpeed);
  
    $("#currentCityContainer").html(currentWeatherDiv);
  }


  async function displayFiveDayForecast() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityname +
      "&units=imperial&appid=4a86248e5662161bd621dea2224441f4";
  
    var response = await $.ajax({
      url: queryURL,
      method: "GET",
    });
    console.log(response);
    var forecastDiv = $("<div class='card-body' id='fiveDayForecast'>");
    var forecastHeader = $("<h5 class='card-header border-secondary'>").text(
      "Five Day Forecast"
    );
    forecastDiv.append(forecastHeader);
    var cardDeck = $("<div class='card-deck'>");
    forecastDiv.append(cardDeck);
  
    console.log(response);
    for (i = 0; i < 5; i++) {
      var forecastCard = $("<div class='card mb-3 mt-3 d-inline-flex p-2'>");
      var cardBody = $("<div class='card-body'>");
      var date = new Date();
      var val =
        (date.getMonth() + 1) +
        "/" +
        (date.getDate() + i + 1) +
        "/" +
        date.getFullYear();
      var forecastDate = $("<h5 class='card-title'>").text(val);
  
      cardBody.append(forecastDate);
      var getCurrentWeatherIcon = response.list[i].weather[0].icon;
      console.log(getCurrentWeatherIcon);
      var displayWeatherIcon = $(
        "<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
      cardBody.append(displayWeatherIcon);
      var getTemperature = response.list[i].main.temp;
      var temperature = $("<p class='card-text'>").text("Temp: " + getTemperature + "° F");

      cardBody.append(temperature);
      var getHumidity = response.list[i].main.humidity;
      var humidityPercent = $("<p class='card-text'>").text("Humidity: " + getHumidity + "%");
      
      
      cardBody.append(humidityPercent);
      forecastCard.append(cardBody);
      cardDeck.append(forecastCard);
    }
    $("#fiveDayContainer").html(forecastDiv);
  }
  
  function historyDisplayWeather() {
    cityname = $(this).attr("data-name");
    displayCurrentWeather();
    displayFiveDayForecast();
    console.log(cityname);
  }
  
  $(document).on("click", ".city", historyDisplayWeather);