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
    fakeglobe.setView([(lat + offsetlat), (lon + offetlon)], zoom);
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
