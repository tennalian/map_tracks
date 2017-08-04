import Vue from 'vue';
import moment from 'moment'
import VueMaterial from 'vue-material';
import '../node_modules/vue-material/dist/vue-material.css';
import datePicker from 'vue-bootstrap-datetimepicker';
import '../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
import Map from './map.js';
import Filters from './components/filters.vue';



import './index.less';

Vue.use(VueMaterial);
Vue.use(datePicker);

const map = new Map('map');
map.init();

var vm = new Vue({
  el: '#filters',
  render: h => h(Filters)
});

vm.map = map;



