import React from 'react';
import ReactDOM from 'react-dom';

export default class Analyser extends React.Component {
  componentDidMount() {
    this.context = ReactDOM.findDOMNode(this).getContext('2d');
    this.draw();
  }
  draw() {
    requestAnimationFrame(this.draw.bind(this));
    var f = this.props.glitch.analyserFreq;
    var t = this.props.glitch.analyserTime;

    var WIDTH = 800;
    var FULL_HEIGHT = 400;
    var HEIGHT = 200;
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, WIDTH, FULL_HEIGHT);
    var sliceWidth = WIDTH * 1.0 / f.length;
    var x = 0;
    for(var i = 0; i < f.length; i++) {
      var v = f[i] / 256.0;
      var y = (v * FULL_HEIGHT);
      this.context.fillStyle = '#eeeeee';
      this.context.fillRect(x, FULL_HEIGHT-y, 4, y);
      x += sliceWidth;
    }

    var x = 0;
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#888888';
    var sliceWidth = WIDTH * 1.0 / t.length;
    for(var i = 0; i < t.length; i++) {
      var value = t[i] / 256;
      var y = FULL_HEIGHT/2 + (HEIGHT * (value-0.5));
      if(i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.context.stroke();
  }
  render() {
    return <canvas width={800} height={400}/>
  }
}


