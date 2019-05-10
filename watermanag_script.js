var map = L.map('map', {
  center: [52, 5],
  zoom: 3,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'rotc931'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM nl_2019merg');
var sourceAll = new carto.source.SQL('SELECT * FROM old_dutch_harbour_projects');
var sourceNew = new carto.source.SQL('SELECT * FROM watermanagementprojects_responses');

// Create style for the data
var style = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #eb5b1c;
  polygon-opacity: 1;
}
#layer::outline {
  line-width: 0;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

var styleAll = new carto.style.CartoCSS(`
#layer {
  marker-width: 10;
  marker-fill: #eb5b1c;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

var styleNew = new carto.style.CartoCSS(`
#layer {
  marker-width: 10;
  marker-fill: #109E8A;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

var layerNew = new carto.layer.Layer(sourceNew, styleNew, {
  featureClickColumns: ['name', 'country', 'city', 'firm', 'link', 'descr'] 
});

var layerAll = new carto.layer.Layer(sourceAll, styleAll, {
  featureClickColumns: ['city', 'country']                                     
});

var layer = new carto.layer.Layer(source, style);

var sidebar = document.querySelector('.sidebar-feature-content');
layerNew.on('featureClicked', function (event) {

  var content = '<h3>' + event.data['name'] + '</h3>'
    content += '<b>Country: </b>: ' + event.data['country'] ;
    content += '<br><br><b>City: </b>' + event.data['city'] ;
    content += '<br><br><b>Firm name: </b> ' + event.data['firm'] ;
    
    content += '<br><br><b>Link to project: </b> ' + event.data['link'] ;
    content += '<br><br><b>Project description: </b> ' + event.data['descr'] ;
 
  sidebar.innerHTML = content;
})
            
layerAll.on('featureClicked', function (event) {

  var content =  '<br><b>Country: </b>: ' + event.data['country'] ;
    content += '<br><br><b>City: </b>' + event.data['city'] ;
 
  sidebar.innerHTML = content;           
})


// Add the data to the map as a layer
client.addLayer(layerAll);
client.addLayer(layer);
client.addLayer(layerNew);
client.getLeafletLayer().addTo(map);

