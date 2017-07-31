import { render } from 'preact';
import './index.less';
import Filters from './views/filters.jsx';

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

let elem = render(Filters, document.getElementById('map'));
