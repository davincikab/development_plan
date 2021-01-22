var accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

var map = L.map('map', {
    center: {lng: 36.5232, lat: 0.2927},
    zoom: 14.4
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom:10,
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
            fillOpacity:0.7,
            weight:1
        }
    },
    onEachFeature:function(feature, layer) {
        let name = feature.properties.name ? feature.properties.name : "Unnamed";
        let popupstring = "<div class='py-2'><h3 class='my-2 text-center'> "+ name +"</h3>"+
         "<p class='d-flex space-between my-2 mx-2'> Use: <b class='uppercase'>"+ getZoneName(feature.properties.zone) +"</b></p>"+
         "<p class='d-flex space-between my-2 mx-2'> Area: <b class='uppercase'>"+ feature.properties.area +" hectares</b></p>"+
         "<p class='d-flex space-between my-2 mx-2'> Proposals: <b class='uppercase'>"+ feature.properties.proposals +"</b></p>"+
         "</div>";

        layer.bindPopup(popupstring);
    },
    filter:function(feature) {
       return true;
    }
}).addTo(map);


function getZoneName(zone) {
    return !zone ? '' : zone.startsWith(0) ? 'residential' : zone.startsWith(1) ? 'industrial' :zone.startsWith(2) ? 'educational'
    : zone.startsWith(3) ? 'recreational':  zone.startsWith(4) ? 'public purpose' :  zone.startsWith(5)  ? 'commercial' 
    : zone.startsWith(6) ? 'public utilities' :  zone.startsWith(7) ? 'transportation' :'others';
    
}

function getColorByZone(feature) {
    let colors = ['brown','purple','orange','#096b20','yellow','red','lightblue', 'grey'];

    // Commercial red, educational light orange, industrial purple, public purpose yellow,
    // Public utilities light blue, Recreational dark green, residential brown transportation grey

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


    map.setMaxBounds(boundaryLayer.getBounds());
})
.catch(error => {
    console.error(error);
});


// create a legend
// Visual Legend
var legendControl = new L.Control({position:"bottomright"});
legendControl.onAdd = function(map) {
    let div = L.DomUtil.create("div", "accordion bg-white");

    div.innerHTML += '<button class="btn btn-block bg-light text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
    'Legend</button>';

   
    let values = ['02', '12', '22','34', '45', '54', '69', '71', ''];
    let labels = ['residential','Industrial', 'Educational','Recreational', 'Public Purpose', 'Commercial', 'Public Utilities', 'Transportation'];

    let legendItems = "";
    values.forEach((value, index) => {
        let color = getColorByZone(value);
        let name = labels[index]
        legendItems += "<div class='legend_wrapper'><div class='legend-item' style='background-color:"+color+"'></div><span>"+name+"</span></div>";
    });

    div.innerHTML += '<div class="collapse" id="collapseOne">'+ legendItems +'</div>';

    return div;
}

legendControl.addTo(map);

// geolocation control
var userLocationMarker = L.marker([0,0]);
var geolocationControl = new L.Control({position:"topright"});

geolocationControl.onAdd = function(map) {
    let div = L.DomUtil.create("button", "btn btn-locate");

    div.innerHTML = "<img src='/static/images/geolocate.svg' alt='geolocate'>";

    div.addEventListener("click", function(e) {
        map.locate();
    });

    return div;
}

map.addControl(geolocationControl);

map.on("locationfound", function(e) {
    // get the user location
    console.log(e);

    // flyto user location
    map.flyTo(e.latlng, 16);

    // add user location marker
    userLocationMarker.setLatLng(e.latlng).addTo(map);

    // update waypoints
    routerControl.setWaypoints([e.latlng, ])
});

map.on("locationerror", function(e) {
    console.log(e);
});

// search tab to various zone name or number

// routing
// routing control
var routerControl = L.Routing.control({
    router: new L.Routing.GraphHopper('8d82257b-bdc9-4c29-b2c3-ea5b0a4780de', {
        urlParameters: {
            vehicle: 'foot',
            locale: 'it'
        }
    }),
    waypoints: [],
    geocoder: L.Control.Geocoder.nominatim(),
    createMarker: function(i, wp) {
          var options = {
        },
          
        marker = L.marker(wp.latLng, options);
        return false;
    },
    lineOptions:{
        styles:[
            {color: '#666', opacity: 1, weight: 2}
        ],
        addWaypoints:false
    }
}).addTo(map);

routerControl.on("routesfound", function(e) {
    console.log(e);
});