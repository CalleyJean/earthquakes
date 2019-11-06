// Map background
console.log("working");

var apiKey = "pk.eyJ1IjoiY2FsbGV5amVhbiIsImEiOiJjazByajdreWEwNnl6M2htdXhvMHppZ3liIn0.S305SenM0k5256R6phyFGQ";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
});

// set central point/zoom
var map = L.map("mapid", {
  center: [
    39.7, -104.9
  ],
  zoom: 4
});

graymap.addTo(map);

// earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson", function(data) {

  // styling map

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

// marker colors
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#6600cc";
    case magnitude > 4:
      return "#ff00ff";
    case magnitude > 3:
      return "#ffff00";
    case magnitude > 2:
      return "#66ff33";
    case magnitude > 1:
      return "#00ccff";
    default:
      return "#d9b3ff";
    }
  }

  // radius based on earthquake size
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  L.geoJson(data, {
    // circle style marker
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
//pop up info
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

 
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
        "#d9b3ff","#00ccff","#66ff33","#ffff00", "#ff00ff", "#6600cc"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // add legend
  legend.addTo(map);
});
