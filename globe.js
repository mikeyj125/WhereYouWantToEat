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
    marker.bindPopup(popstring, {maxWidth: 400, closeButton: true}).openPopup(); 
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
    if (website == null){
        website = " "
    }
    var contents = "<h1>" + name + "</h1><div id='address'>" + address + "</div><div id='phone'>" + phone + "</div><div id='website>" + website + "</div>";
    addPopup(lat, lon, contents, globe);
    flyToFood(lat, lon, 18, globe, fakeglobe);  
}
function getPlace() {
    var location = $("#zip").val();
    var request = {
        location: $("#zip").val(),
        radius: "6000",
        openNow: "true",
        query: $("#cuisine").val(),
    };
    var url = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=" + request.query + "&postalCode="+ request.location +"&key=AijXjmcFJtkiCBnTvxhwx7aRM0ICYB2-bQ8gFDp5glzXGN2-rAlCK_pqnmzPuZ2k&type=EatDrink&maxResults=20"
    console.log(url)
    var json = $.getJSON({'url': url, 'async': false});  

    //The next line of code will filter out all the unwanted data from the object.
    json = JSON.parse(json.responseText); 

    //You can now access the json variable's object data like this json.a and json.c
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
    $(document).on("keypress", "input", function(e){
        if(e.which == 13){
            var inputVal = $(this).val();
            getPlace();
        }
    });

