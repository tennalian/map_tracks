import Vue from 'vue'
import Map from './map.js';
import Filters from './components/filters.vue';

import './index.less';

const map = new Map('map');
map.init();

new Vue({
  el: '#filters',
  render: h => h(Filters)
});



