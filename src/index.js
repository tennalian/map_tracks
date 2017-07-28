import './index.less';

class Map {
  constructor(id) {
    this.id = id;
    this.layer = L.layerGroup(null);
    this.map = {};
    this.TRACK_OPTIONS = {
      weight: 4,
      opacity: 1,
      color: '#07a64f'
    };
    this.UNDER_OPTIONS = {
      weight: 6,
      opacity: 1,
      color: '#ffffff'
    };
    this.data = null;
  }

  init() {
    this.map = L.map(this.id, {
      zoom: 15,
      center: [45.51, -122.68]
    });

    L.tileLayer('http://tiles.maps.sputnik.ru/tiles/kmt2/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://maps.sputnik.ru/" target="_blank">Спутник</a>'
    }).addTo(this.map);
    this.layer.addTo(this.map);
    this.get();
  }

  drawPath(points) {
    var track = points.map(point => [point.lat, point.lng]);
    var polyline = L.polyline(track, this.TRACK_OPTIONS);

    this.map.removeLayer(this.layer);
    this.layer = L.layerGroup([L.polyline(track, this.UNDER_OPTIONS), polyline]);
    this.layer.addTo(this.map);
    this.map.fitBounds(polyline.getBounds());
  }

  get() {
    const url = 'http://gps1.beforydeath.ru:8080/points/filter';
    const params = {
      id: "49f2d315-ebd7-4a53-b423-cdbe1c063c0a",
      time_from: "2017-04-27T00:00:00Z",
      time_to: "2017-04-27T23:59:59Z"
    };


    let options = {
      method: 'POST',
      redirect: 'error',
      credentials: 'same-origin',
      body: JSON.stringify(params)
    };

    return fetch(url, options).then(fetchData => {
      console.log(fetchData)
    }, err => {
      console.log(err)
    })

    // $.ajax({
    //     type: "POST",
    //     url: "http://gps1.beforydeath.ru:8080/points/filter",
    //     data: JSON.stringify(params),
    //     dataType: "JSON",
    //     async: false,
    //     success: function (data) {
    //         console.log(data);
    //         res = data
    //     }
    // });
  }

  setData(data) {
    this.data = data;
  }

  update() {
    this.get();
  }
}

var map = new Map('map');
map.init();




//     data =  {
//         id: "49f2d315-ebd7-4a53-b423-cdbe1c063c0a",
//         time_from: "2017-04-27T00:00:00Z",
//         time_to: "2017-04-27T23:59:59Z"
//     };

//     var res;

//     $.ajax({
//         type: "POST",
//         url: "http://gps1.beforydeath.ru:8080/points/filter",
//         data: JSON.stringify(data),
//         dataType: "JSON",
//         async: false,
//         success: function (data) {
//             console.log(data);
//             res = data
//         }
//     });

//     var RAW_DATA = [];
//     for (var key in res.data.raw) {
//         var I = [res.data.raw[key].lat, res.data.raw[key].lon];
//         RAW_DATA.push(I);
//     }

//     var EXTRA_DATA = [];
//     for (var key in res.data.extra) {
//         var I = [res.data.extra[key].lat, res.data.extra[key].lon];
//         EXTRA_DATA.push(I);
//     }

//     var mymap = L.map('mapid');
//     L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//         maxZoom: 18,
//         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//         id: 'mapbox.streets'
//     }).addTo(mymap);

//     var polyline = L.polyline(
//         [RAW_DATA],
//         {
//             color: 'red',
//             weight: 4,
//             opacity: 0.3,
//             smoothFactor: 1
//         }).addTo(mymap);

//     var polyline2 = L.polyline(
//         [EXTRA_DATA],
//         {
//             color: 'blue',
//             weight: 2,
//             opacity: 1,
//             smoothFactor: 1
//         }).addTo(mymap);

//     mymap.fitBounds(polyline.getBounds());

//     var popup = L.popup();
//     function onMapClick(e) {
//         popup
//             .setLatLng(e.latlng)
//             .setContent("You clicked the map at " + e.latlng.toString())
//             .openOn(mymap);
//     }
//     mymap.on('click', onMapClick);