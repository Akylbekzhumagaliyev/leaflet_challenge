var map = L.map("map",{
    center:[37.70, -122.20], 
    zoom: 9
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

var jsonLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function chooseColor(mag) {
    switch (true) {
    case (mag < 1):
      return "rgb(191, 255, 0)";
      break;
    case (mag < 2):
      return "rgb(255, 255, 0)";
      break;
    case (mag < 3):
      return "rgb(255, 191, 0)";
      break;
    case (mag < 4):
      return "rgb(255, 128, 0)";
      break;
    case (mag < 5):
      return "rgb(255, 64, 0)";
      break;
    default:
      return "rgb(255, 0, 0)";
    }
  };

  function chooseRadius(mag) {
    switch (true) {
    case (mag < 1):
      return "4";
      break;
    case (mag < 2):
      return "6";
      break;
    case (mag < 3):
      return "8";
      break;
    case (mag < 4):
      return "10";
      break;
    case (mag < 5):
      return "12";
      break;
    case (mag < 6):
      return "14";
      break;
    default:
      return "18";
    }
  };

  d3.json(jsonLink, function(data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,{
            radius: chooseRadius(feature.properties.mag),
            color: "black",
            fillColor: chooseColor(feature.properties.mag),
            fillOpacity: 0.8,
            weight: 1
        });
      },

      onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                fillOpacity: 1.5,
                weight: 2
            });
          },
            mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                fillOpacity: 0.8,
                weight: 1
            });
          },
        });
        layer.bindPopup("<h3> Place: " + feature.properties.place + "</h3> <hr> <h2> Magnitude: " + feature.properties.mag + "</h2>");
        }
  
    }).addTo(map);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend"),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    } 
    return div;
    };
    
    legend.addTo(map);
  });