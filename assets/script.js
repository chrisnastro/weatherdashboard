var recentCities = [];
var cityname;
listRecentCities();
initWeather();

function renderCities() {
  $("#recentCities").empty();
  $("#currentSearch").val("");

  for (i = 0; i < recentCities.length; i++) {
    var a = $("<a>");
    a.addClass(
      "list-group-item list-group-item-action list-group-item-primary city"
    );
    a.attr("data-name", recentCities[i]);
    a.text(recentCities[i]);
    $("#recentCities").prepend(a);
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
      alert("Please enter a city to look up");
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
    var currentCityEl = $("<h3 class = 'card-body'>").text(
      getCurrentCity + " (" + val + ")"
    );
    currentCityEl.append(displayCurrentWeatherIcon);
    currentWeatherDiv.append(currentCityEl);
    var getTemp = response.main.temp.toFixed(1);
    var tempEl = $("<p class='card-text'>").text(
      "Temperature: " + getTemp + "° F"
    );
    currentWeatherDiv.append(tempEl);
    var getHumidity = response.main.humidity;
    var humidityPercent = $("<p class='card-text'>").text(
      "Humidity: " + getHumidity + "%"
    );
    currentWeatherDiv.append(humidityPercent);
    var getWindSpeed = response.wind.speed.toFixed(1);
    var windSpeedEl = $("<p class='card-text'>").text(
      "Wind Speed: " + getWindSpeed + "mph"
    );
    currentWeatherDiv.append(windSpeedEl);
    var getLong = response.coord.lon;
    var getLat = response.coord.lat;
  
    var uvURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=4a86248e5662161bd621dea2224441f4&lat=" +
      getLat +
      "&lon=" +
      getLong;
    var uvResponse = await $.ajax({
      url: uvURL,
      method: "GET",
    });
  
    $("#currentCityContainer").html(currentWeatherDiv);
  }
  
  