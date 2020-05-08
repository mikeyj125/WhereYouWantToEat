function doubleGlobe(lat, lon, divtype1, divtype2){
    /* I hate this solution but it works so...*/
    var globe = initialize(lat,lon, divtype1);
    var fakeglobe = initialize(lat,lon, divtype2);
    return [globe, fakeglobe]
}

function initialize(lati, long, divtype) {
    var earth = new WE.map(divtype, options);
    var lat = lati
    var lon = long
    var options = {atmosphere: true, center: [lat, lon], zoom: 0};
    var marker = WE.marker([lat, lon]).addTo(earth);
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 25,
      attribution: 'OpenStreetMap'
    }).addTo(earth);
    return earth
  }

function addPopup(lat, lon, popstring, earth){
       var marker = WE.marker([lat, lon]).addTo(earth);
    marker.bindPopup(popstring, {maxWidth: 400, closeButton: true}).openPopup(); 
}
                              
function flyToFood(lat, lon, zoom, earth, fakeearth) {
    /* Using the second globe to determine the layout bounds to pan to with a shaweet animation */
    earth.panInsideBounds(fakeFindPort(lat, lon, zoom, fakeearth));
      }

function fakeFindPort(lat, lon, zoom, fakeglobe){
    /* Offset is needed if we want to fit the popup window on screen */
    var offsetlat = .005
    var offsetlon = .000
    fakeglobe.setView([(lat + offsetlat), (lon + offsetlon)], zoom);
    viewport = fakeglobe.getBounds();
    return viewport
}

function sleep(milliseconds) {
  var date = Date.now();
  var currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
function presentWinner(winner){
    var location = winner.Geometry.location;
    var name = winner.Name;
    var address = winner.formatted_address;
    var attribution = winner.html_attributions;
    var phone = winner.formatted_phone_number;
    var contents = "<h1>" + name + "</h1>" + address + "<br>" + phone + "<br>" + attribution;
    addPopup(location.lat(),location.lon(), contents, globe);
    
}
function getPlace() {
    console.warn("About to declare places service")
    service = new google.maps.places.PlacesService(fakemap);
    var location = $("#zip").val();
    var request = {
        location: $("#zip").val(),
        radius: "6000",
        type: ["restaurant"],
        openNow: "true",
        query: $("#cuisine").val(),
    };
    console.warn("About to perform text search for " + $("#cuisine").val() )
    console.warn(service.textSearch(request, callback()));
    
}
function callback(results, status) {
    console.warn("Inside Callback1")
    console.warn(results)
/* This takes the random function (which returns a number between 0 and 1, and 
and multiplies it by the number of results we got, to give a random int to grab so we
can randomly pick a restaurant, then feeds the result to the globe*/
        var picked = Math.floor((Math.random() * results.length) + 1);
      var winner = results[picked];
      var details = {
          placeId: winner.place_id,
          fields: ["name", "geometry", "formatted_address", "formatted_phone_number", "place_id"]
      }
      service = new google.maps.places.PlacesService(fakemap);
      service.getDetails(request, callback2)
  }

function callback2(place, status) {
    console.warn("Inside Callback2")
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        presentWinner(place);
    }
}

/* Regard hitting enter as trying to click the submit button */
    $(document).on("keypress", "input", function(e){
        if(e.which == 13){
            var inputVal = $(this).val();
            getPlace();
        }
    });

