// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([52.378, 4.9], 7.5);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'rotc931'
});

// Initialze source data

var source3 = new carto.source.SQL('SELECT * FROM nl_dotmap_w50_final');
var source2 = new carto.source.SQL('SELECT * FROM nl_dotmap_nw50_final');
var source1 = new carto.source.SQL('SELECT * FROM nl_dotmap_none50_final');
var source0 = new carto.source.SQL('SELECT * FROM table_2_nl_dotmap_50_1');

// Create style for the data
var style0 = new carto.style.CartoCSS(`
#layer {
  marker-width: 0.5;
  marker-fill: #FFFFFF;
  marker-fill-opacity: 0.1;
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
  marker-comp-op: darken;


 [zoom <= 8] {
    marker-width: 1;
  }
  [zoom <= 12] {
    marker-width: 3;
  }
  [zoom >= 13] {
    marker-width: 6;
  }
}
`);


var style1 = new carto.style.CartoCSS(`
#layer {
  marker-width: 1;
  marker-fill: #109e8b;
  marker-fill-opacity: 0.7;
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
  marker-comp-op: lighten;


 [zoom <= 10] {
    marker-width: 1;
  }
  [zoom <= 12] {
    marker-width: 3;
  }
  [zoom >= 13] {
    marker-width: 6;
  }
}
`);

var style2 = new carto.style.CartoCSS(`
#layer {
  marker-width: 1;
  marker-fill: #ab22a7;
  marker-fill-opacity: 0.7;
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
  marker-comp-op: lighten;


 [zoom <= 10] {
    marker-width: 1;
  }
  [zoom <= 12] {
    marker-width: 3;
  }
  [zoom >= 13] {
    marker-width: 6;
  }
}
`);

var style3 = new carto.style.CartoCSS(`
#layer {
  marker-width: 1;
  marker-fill: #ebbc0c;
  marker-fill-opacity: 0.7;
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
  marker-comp-op: lighten;


 [zoom <= 10] {
    marker-width: 1;
  }
  [zoom <= 12] {
    marker-width: 3;
  }
  [zoom >= 13] {
    marker-width: 6;
  }
}
`);

// Combine style and data to make a layer
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below

var layer3 = new carto.layer.Layer(source3, style3);
var layer2 = new carto.layer.Layer(source2, style2);
var layer1 = new carto.layer.Layer(source1, style1);
var layer0 = new carto.layer.Layer(source0, style0);

// Add the data to the map as a layer
client.addLayer(layer3);
client.addLayer(layer2);
client.addLayer(layer1);
client.addLayer(layer0);
client.getLeafletLayer().addTo(map);




// count persons with no migration background
map.on('click', function (e) {
  console.log(e.latlng);
  // We want the SQL to look something like this (lat: 40.732, lng: -73.986)
  // SELECT * FROM nypd_motor_vehicle_collisions WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(40.732,-73.986), 2263),10000))
  
  // So place the lat and lng in the query at the appropriate points
  var sql = 'SELECT * FROM nl_dotmap_none50_final WHERE ST_Within(ST_Transform(the_geom, 28992), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 28992),7000))';
  console.log(sql);
  
  source1.setQuery(sql);
  
  // Make SQL to get the summary data you want
  var countSql = 'SELECT SUM(persons) FROM nl_dotmap_none50_final WHERE ST_Within(ST_Transform(the_geom, 28992), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 28992),7000))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://rotc931.carto.com/api/v2/sql/?q=' + countSql)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var sumPeople = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer = document.querySelector('.sidebar-feature-content-none');

      // Add the text including the sum to the sidebar
      sidebarContainer.innerHTML = '<div>There are <b> ' + sumPeople + '</b> persons with no migration background living in this area</div>';
    });
});

// count persons with non-western migration background
map.on('click', function (e) {
  console.log(e.latlng);
  // We want the SQL to look something like this (lat: 40.732, lng: -73.986)
  // SELECT * FROM nypd_motor_vehicle_collisions WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(40.732,-73.986), 2263),10000))
  
  // So place the lat and lng in the query at the appropriate points
  var sql = 'SELECT * FROM nl_dotmap_nw50_final WHERE ST_Within(ST_Transform(the_geom, 28992), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 28992),7000))';
  console.log(sql);
  
  source2.setQuery(sql);
  
  // Make SQL to get the summary data you want
  var countSql = 'SELECT SUM(persons) FROM nl_dotmap_nw50_final WHERE ST_Within(ST_Transform(the_geom, 28992), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 28992),7000))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://rotc931.carto.com/api/v2/sql/?q=' + countSql)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var sumPeople = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer = document.querySelector('.sidebar-feature-content-nw');

      // Add the text including the sum to the sidebar
      sidebarContainer.innerHTML = '<div>There are<b> ' + sumPeople + ' </b>persons with a non-western migration background living in this area</div>';
    });
});

// count persons with western migration background
map.on('click', function (e) {
  console.log(e.latlng);
  // We want the SQL to look something like this (lat: 40.732, lng: -73.986)
  // SELECT * FROM nypd_motor_vehicle_collisions WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(40.732,-73.986), 2263),10000))
  
  // So place the lat and lng in the query at the appropriate points
  var sql = 'SELECT * FROM nl_dotmap_w50_final WHERE ST_Within(ST_Transform(the_geom, 28992), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 28992),7000))';
  console.log(sql);
  
  source3.setQuery(sql);
  
  // Make SQL to get the summary data you want
  var countSql = 'SELECT SUM(persons) FROM nl_dotmap_w50_final WHERE ST_Within(ST_Transform(the_geom, 28992), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 28992),7000))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://rotc931.carto.com/api/v2/sql/?q=' + countSql)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var sumPeople = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer = document.querySelector('.sidebar-feature-content-w');

      // Add the text including the sum to the sidebar
       sidebarContainer.innerHTML = '<div>There are <b> ' + sumPeople + '</b> persons with a western migration background living in this area</div>';
    });
});


