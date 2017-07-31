import React from 'react'
import { h, Component } from 'preact';
import { render } from 'react-dom'
import Button  from 'preact-material-components/Button';

export default class Filters extends Component {
	constructor(props) {
		super(props);
		this.getData = this.getData.bind(this);
	}
	getData() {
		console.log(this)
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
    return fetch(url, options)
    	.then((resp) => resp.json())
    	.then(fetchData => {
    		console.log(fetchData.data.raw)
    		const points = _.chain(fetchData.data.raw)
    			.reject(_.matches({lat: 0, lon: 0}))
    			.map(point => {
	    			return [point.lat, point.lon]
	    		})
	    		.value();

	    	console.log(_.size(fetchData.data.raw))
	    	console.log(_.size(points))
    		this.props.map.update(points);

    	})
    	.catch(err => console.log(err))
  }
  render() {
    return (
      <div>
        <Button ripple={true} primary={true} raised={true} onClick={this.getData}>
          Get track
        </Button>
      </div>
    );
  }
};