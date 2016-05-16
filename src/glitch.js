import * as expr from 'expr'
import * as functions from './glitchFuncs'

export default class Glitch {
  constructor(sampleRate = 44100) {
    this.expr = () => 0
    this.src = '';
    this.sampleRate = sampleRate
    this.reset()
  }
  reset() {
    this.vars = {'t': expr.varExpr(0), 'r': expr.varExpr(0)};
    this.expr = expr.parse(this.src, this.vars, functions)
  }
  compile(e) {
    let f = expr.parse(e, this.vars, functions)
    if (f) {
      this.src = e
      this.expr = f
      return true
    }
    return false
  }
  nextSample() {
    var v = this.expr();
    v = (v&0xff)/0x80 - 1;
    this.vars.r(this.vars.r()+1);
    this.vars.t(Math.round(this.vars.r()* 8000 / this.sampleRate));
    return v;
  }
  onaudioprocess(e) {
    var buffer = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < buffer.length; i++) {
      buffer[i] = this.nextSample();
    }
  }
}
