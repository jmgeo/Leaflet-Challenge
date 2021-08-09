//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

//point to the API and queryURL
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Get the data from the JSON with D3
d3.json(quakeURL, function(data) {
    console.log (data)
    createFeatures(data.features);
});

//create the functions to run on the features
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData), {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3> Location: " + feature.properties.place + "</h3><hr><p> Date/Time: " + new Date(feature.properties.time) + "</p><p> Magnitude: " + feature.properties.mag + "</p>"); 
        },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: circleColor(earthquakeData.geometry.coordinates[2]),
              fillOpacity: .6,
              color: "black",
              stroke: true,
              weight: .8
            })
        }
    });
    createMap (earthquakes);
}
