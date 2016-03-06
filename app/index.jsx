import './index.html';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactSlider from 'react-slider';

import Glitch from './glitch.jsx';
import Filters from './filters.jsx';
import Debugger from './debugger.jsx';
import Visualizer from './visualizer.jsx';

class App extends React.Component {
  constructor() {
    super();
    try {
      this.glitch = new Glitch();
    } catch(e) {
      console.log(e);
    }
  }
  render() {
    if (this.glitch) {
      return <div>
        <ExprInput glitch={this.glitch} />
        <PlayButton glitch={this.glitch} />
        <Filters glitch={this.glitch} />
        <Debugger glitch={this.glitch} />
        <Visualizer glitch={this.glitch} />
      </div>;
    } else {
      return <p>You browder doesn't support WebAudio API, sorry</p>;
    }
  }
}

class PlayButton extends React.Component {
  constructor() {
    super();
    this.state = {playing: false};
  }
  toggle() {
    this.props.glitch.togglePlayback();
    this.setState({playing: this.props.glitch.playing});
  }
  render() {
    return <div>
      <button onClick={this.toggle.bind(this)}>{this.state.playing ? 'Stop' : 'Play'}</button>
    </div>
  }
}

class ExprInput extends React.Component {
  constructor() {
    super();
    this.state = {text: "(t*((3+(1^t>>10&5))*(5+(3&t>>14))))>>(t>>8&3)"};
    this.setText = (e) => {
      this.setState({text: e.target.value});
      this.props.glitch.setExpr(e.target.value);
    };
  }
  render() {
    return <div style={{backgroundColor: (this.props.glitch.error ? 'red' : 'white')}}>
      <input type="text"
        size={80}
        value={this.state.text}
        onChange={this.setText}
      />
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('container'));
