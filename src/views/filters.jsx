import { h, Component } from 'preact';
import Button  from 'preact-material-components/Button';

export default class Filters extends Component {
  render() {
    return (
      <div class="filters">
        <Button ripple={true} primary={true} raised={true}>
          Click me
        </Button>
      </div>
    );
  }
};