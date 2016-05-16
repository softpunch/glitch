import React from 'react'
import ReactDOM from 'react-dom'

import {PINK, GRAY, GREEN} from '../colors'

import {analyser} from '../audio'

const wrapperStule = {
  flex: 1,
  margin: '0 0 0 1em',
}

export default class Visualizer extends React.Component {
  constructor() {
    super()
    this.draw = this.draw.bind(this)
    this.onresize = this.onresize.bind(this)
    this.f = new Uint8Array(analyser.frequencyBinCount)
    this.t = new Uint8Array(analyser.frequencyBinCount)
  }
  componentDidMount() {
    this.context = this.refs.canvas.getContext('2d');
    window.addEventListener('resize', this.onresize);
    this.onresize();
    this.draw();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onresize);
  }
  onresize() {
    this.width = this.refs.wrapper.offsetWidth;
    this.height = this.refs.wrapper.offsetHeight;
    this.forceUpdate();
  }
  draw() {
    requestAnimationFrame(this.draw)
    this.context.fillStyle = GRAY
    this.context.fillRect(0, 0, this.width, this.height);
    this.drawFFT(this.width, this.height)
    this.drawWaveForm(this.width, this.height)
  }
  drawFFT(width, height) {
    analyser.getByteFrequencyData(this.f)
    var x = width * 0.05;
    var v = 0;
    var sliceWidth = width * 1.0 / this.f.length;
    for(var i = 0; i < this.f.length; i++) {
      if (i % 10 == 0) {
        var y = (v * height * 0.45);
        this.context.fillStyle = PINK
        this.context.fillRect(x, height/2-y/20, 5*sliceWidth, y/10);
        v = 0;
      }
      v = v + this.f[i] / 256.0;
      x += sliceWidth;
    }
  }
  drawWaveForm(width, height) {
    analyser.getByteTimeDomainData(this.t)
    var x = width * 0.05;
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = GREEN
    var sliceWidth = width * 0.95 / this.t.length;
    for(var i = 0; i < this.t.length; i++) {
      var value = this.t[i] / 256;
      var y = height * 0.5 - (height * 0.45 * (value-0.5));
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.context.stroke();
  }
  render() {
    return <div ref="wrapper" style={wrapperStule}>
      <canvas ref="canvas" width={this.width} height={this.height} style={{width: '100%', height: this.height}} />
    </div>
  }
}

