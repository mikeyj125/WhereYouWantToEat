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
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 25,
      attribution: 'OpenStreetMap'
    }).addTo(earth);
    return earth
  }

function addPopup(lat, lon, popstring, earth){
       var marker = WE.marker([lat, lon]).addTo(earth);
    marker.bindPopup(popstring, {maxWidth: 600, closeButton: true}).openPopup(); 
}
                              
function flyToFood(lat, lon, zoom, earth, fakeearth) {
    /* Using the second globe to determine the layout bounds to pan to with a shaweet animation */
    earth.panInsideBounds(fakeFindPort(lat, lon, zoom, fakeearth));
      }

function fakeFindPort(lat, lon, zoom, fakeglobe){
    /* Offset is needed if we want to fit the popup window on screen */
    var offsetlat = .000
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
function presentWinner(name, address, phone, website, lat, lon){
    var contents = "<div id='restname'>" + name + "</div><div id='address'>" + address + "</div><div id='phone'><img src='Phone-icon.png' id='phoneicon'> " + phone + "</div><div id='website>" + website + "</div>";
    addPopup(lat, lon, contents, globe);
    flyToFood(lat, lon, 18, globe, fakeglobe);  
}
function getPlace() {
    var zipurl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + $("#zip").val() + "&sensor=false&key=AIzaSyBnIrhidN5aiBFBVK9kgPDrISe0_MePQpw"; 
    var jsonzip = $.getJSON({'url': zipurl, 'async': false});
    console.log(jsonzip);
    jsonzips = JSON.parse(jsonzip.responseText); 
    var ziplat = jsonzips.results[0].geometry.location.lat;
    var ziplon = jsonzips.results[0].geometry.location.lng;
    var query = $("#cuisine").val();
    var url = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=" + query + "&userLocation="+ ziplat + "," + ziplon +"&key=AijXjmcFJtkiCBnTvxhwx7aRM0ICYB2-bQ8gFDp5glzXGN2-rAlCK_pqnmzPuZ2k&type=EatDrink&maxResults=20"
    console.log(url)
    var json = $.getJSON({'url': url, 'async': false});  
    json = JSON.parse(json.responseText); 
    console.log(json);
    picked = Math.floor((Math.random() * json.resourceSets[0].estimatedTotal));
    console.log(picked);
    var winner = json.resourceSets[0].resources[picked];
    var latitude = winner.geocodePoints[0].coordinates[0];
    var longitude = winner.geocodePoints[0].coordinates[1];
    var name = winner.name;
    var address = winner.Address.formattedAddress;
    var phone = winner.PhoneNumber;
    var website = winner.Website;
    presentWinner(name, address, phone, website, latitude, longitude);
    
    
}


/* Regard hitting enter as trying to click the submit button */
            $("#zip").keypress(function(e) {
                //Enter key
                if (e.which == 13) {
                    getPlace();
                }
            });