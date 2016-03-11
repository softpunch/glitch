import React from 'react';
import ReactDOM from 'react-dom';

export default class Visualizer extends React.Component {
  constructor() {
    super();
    this.onresize = this.forceUpdate().bind(this);
  }
  componentDidMount() {
    this.context = this.refs.canvas.getContext('2d');
    window.addEventListener('resize', this.onresize);
    this.draw();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onresize);
  }
  draw() {
    requestAnimationFrame(this.draw.bind(this));
    var f = this.props.glitch.analyserFreq;
    var t = this.props.glitch.analyserTime;

    this.width = this.refs.root.offsetWidth;

    var WIDTH = this.width * 0.95;
    var LEFT = this.width * 0.05;
    var FULL_HEIGHT = 72 * 0.9;
    var HEIGHT = FULL_HEIGHT*0.5;

    this.context.fillStyle = '#333333';
    this.context.fillRect(0, 0, this.width, 72);
    var sliceWidth = WIDTH * 1.0 / f.length;
    var x = LEFT;
    var v = 0;
    for(var i = 0; i < f.length; i++) {
      if (i % 10 == 0) {
        var y = (v * HEIGHT);
        this.context.fillStyle = '#e91e63';
        //this.context.fillStyle = '#ffc107';
        this.context.fillRect(x, FULL_HEIGHT/2-y/20, 5*sliceWidth, y/10);
        v = 0;
      }
      v = v + f[i] / 256.0;
      x += sliceWidth;
    }

    var x = LEFT;
    this.context.beginPath();
    this.context.lineWidth = 2;
    //this.context.strokeStyle = '#ffc107';
    this.context.strokeStyle = '#cddc39';
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
    return <div ref="root" style={{flex: '1', position: 'relative'}}>
      <canvas ref="canvas" width={this.width} height={72} style={{width: '100%', height: '72px'}}/>
    </div>
  }
}


