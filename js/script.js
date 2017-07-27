(function() {
  class Map {
    constructor(id) {
      this.id = id;
      this.layer = L.layerGroup();
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
    }

    init() {
      this.map = L.map(this.id, {
        zoom: 15,
        center: [45.51, -122.68]
      });

      L.tileLayer('http://tiles.maps.sputnik.ru/tiles/kmt2/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://maps.sputnik.ru/">Спутник</a>'
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
      var latlngs = [{lat: 45.51, lng: -122.68}, {lat: 37.77, lng: -122.43}, {lat: 34.04, lng: -118.2}];
      this.drawPath(latlngs);
    }

    update() {
      this.get();
    }
  }

  var map = new Map('map');
  map.init();
  map.get();
  map.get();

})();