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

