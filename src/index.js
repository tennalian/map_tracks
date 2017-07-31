import React from 'react';
import { render } from 'react-dom';

import './index.less';

import Map from './components/map.js';
import Filters from './components/filters.js';



const map = new Map('map');
map.init();
console.log(map)
render(<Filters map={map}/>, document.querySelector('#filters'));
