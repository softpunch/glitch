import * as expr from 'expr';
import * as functions from './glitchFuncs';

export default class Glitch {
  constructor(sampleRate = 44100) {
    this.expr = () => 0;
    this.src = '';
    this.sampleRate = sampleRate;
    this.reset();
  }
  reset() {
    this.vars = {
      t: expr.varExpr(0),
      x: expr.varExpr(),
      y: expr.varExpr(0),
    };
    this.expr = expr.parse(this.src, this.vars, functions);
    this.frame = 0;
    this.measure = 0;
  }
  compile(e) {
    const f = expr.parse(e, this.vars, functions);
    if (f) {
      this.src = e;
      this.nextExpr = f;
      return true;
    }
    return false;
  }
  nextSample() {
    const v = this.expr();
    if (!isNaN(v)) {
      this.lastSample = (((v % 256) + 256) % 256) / 128 - 1;
    }
    this.frame++;
    if (this.vars.bpm) {
      this.measure++;
      if (this.measure > this.sampleRate * 60 / this.vars.bpm()) {
        this.measure = 0;
        this.expr = this.nextExpr;
      }
    } else {
      this.expr = this.nextExpr;
    }
    this.vars.t(Math.round(this.frame * 8000 / this.sampleRate));
    return this.lastSample;
  }
  onaudioprocess(e) {
    const buffer = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = this.nextSample();
    }
  }
}
