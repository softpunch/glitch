import React from 'react';

export default class Filters extends React.Component {
  setDelay(e) {
    this.props.glitch.delay.delayTime.value = e.target.value/1000;
  }
  setLPFreq(e) {
    this.props.glitch.lp.frequency.value = e.target.value;
  }
  setLPCue(e) {
    this.props.glitch.lp.gain.value = e.target.value;
  }
  setHPFreq(e) {
    this.props.glitch.hp.frequency.value = e.target.value;
  }
  setHPCue(e) {
    this.props.glitch.hp.gain.value = e.target.value;
  }
  render() {
    return <div>
      <p>Delay</p>
      <input type="range" min={0} max={8000} onChange={this.setDelay.bind(this)}/>
      <p>LP</p>
      <input type="range" min={0} max={4000} onChange={this.setLPFreq.bind(this)}/>
      <input type="range" min={-40} max={40} onChange={this.setLPCue.bind(this)}/>
      <p>HP</p>
      <input type="range" min={0} max={8000} onChange={this.setHPFreq.bind(this)}/>
      <input type="range" min={-40} max={40} onChange={this.setHPCue.bind(this)}/>
    </div>
  }
}
