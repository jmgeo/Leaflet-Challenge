//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson

//point to the API and queryURL
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

//Get the data from the JSON with D3
d3.json(quakeURL, function(data) {
    console.log (data)
    createFeatures(data.features);
});