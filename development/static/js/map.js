var accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

var alertId;
var allAlerts = [];
var viewAllRecords = document.getElementById('all-records');
var declineAlerts = document.querySelectorAll(".decline");
var respondAlerts = document.querySelectorAll('.response');
var alerts = document.querySelectorAll(".view");

var map = L.map('map', {
    center: {lng: 36.5232, lat: 0.2927},
    zoom: 14.4
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken
}).addTo(map);

var riversLayer = L.geoJson(null, {
    style:function(feature) {
        return {
            color:'blue',
            weight:1
        }
    }
}).addTo(map);

var boundaryLayer = L.geoJSON(null, {
    style:function(feature) {
        return {
            color:'brown',
            weight:3
        }
    }
}).addTo(map);

var parcelsLayer = L.geoJSON(null, {
    style:function(feature) {
        return {
            fillColor:getColorByZone(feature),
            color:'#ddd',
            weight:1
        }
    },
    onEachFeature:function(feature, layer) {
        let popupstring = "<div><h3></h3>"+
         "<p class='d-flex space-between my-2 mx-2'> Use: <b class='uppercase'>"+ getZoneName(feature.properties.zone) +"</b></p>"+
        "</div>";

        layer.bindPopup(popupstring);
    }
}).addTo(map);


function getZoneName(zone) {
    return !zone ? '' : zone.startsWith(0) ? 'residential' : zone.startsWith(1) ? 'industrial' :zone.startsWith(2) ? 'educational'
    : zone.startsWith(3) ? 'recreational':  zone.startsWith(4) ? 'public purpose' :  zone.startsWith(5)  ? 'commercial' 
    : zone.startsWith(6) ? 'public utilities' :  zone.startsWith(7) ? 'transportation' :'others';
    
}

function getColorByZone(feature) {
    let colors = ['#3d5941','#778868','#b5b991','#f6edbd','#edbb8a','#de8a5a','#ca562c'];
    let zone= feature.properties ? feature.properties.zone : feature;

    if (zone == "" || !zone) { return '#ddd'}
    let color =  zone.startsWith(0) ? colors[0] : zone.startsWith(1) ? colors[1] :zone.startsWith(2) ? colors[2]
    : zone.startsWith(3) ? colors[3] :  zone.startsWith(4) ? colors[4] :  zone.startsWith(5)  ? colors[5] 
    :  zone.startsWith(6) ? colors[6] :  zone.startsWith(7) ? colors[7] :'';
    
   
    // 0-residential, 1- industrial, 2-  educational, 3- recreational, 4-public purpose, 5- commercial, 6- public utilities, 7-transportation
    return color;
}

var roadsLayer =  L.geoJSON(null, {
    style:function(feature) {
        return {
            color:'red',
            weight:1
        }
    }
}).addTo(map);

fetch('/data/')
.then(res => res.json())
.then(data => {
    const { rivers, roads, boundary, parcels } = data;

    // add the data to map
    riversLayer.addData(JSON.parse(rivers));
    roadsLayer.addData(JSON.parse(roads));
    boundaryLayer.addData(JSON.parse(boundary));
    parcelsLayer.addData(JSON.parse(parcels));


})
.catch(error => {
    console.error(error);
});


// create a legend
// Visual Legend
var legendControl = new L.Control({position:"bottomright"});
legendControl.onAdd = function(map) {
    let div = L.DomUtil.create("div", "accordion bg-white");

    div.innerHTML = '<button class="btn btn-block bg-light text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
    'Legend</button>';

    div.innerHTML += '<div class="collapse" id="collapseOne">'
    let values = ['02', '12', '22','34', '54', '69', '71', ''];
    let labels = ['residential','Industrial', 'Educational','Recreational', 'Public Purpose', 'Commercial', 'Public Utilities', 'Transportation'];

    values.forEach((value, index) => {
        let color = getColorByZone(value);
        let name = labels[index]
        div.innerHTML += "<div class='legend_wrapper'><div class='legend-item' style='background-color:"+color+"'></div><span>"+name+"</span></div>";
    });

    div.innerHTML += '</div>';

    return div;
}

legendControl.addTo(map);