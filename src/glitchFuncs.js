import {sampleRate} from './audio'

function denorm(x) {
  return x * 127 + 128
}

function arg(x, defaultValue) {
  if (!x) {
    return defaultValue;
  } else {
    return x();
  }
}

// Returns sine value, argument is wave phase 0..255, result is in the range 0..255
export function s(a) {
  if (a) {
    return Math.sin(a()*Math.PI/128) * 127 + 128
  } else {
    return 0;
  }
}

// Returns random number in the range 0..max
export function r(max) {
  return Math.random()*arg(max, 255);
}

// Returns log2 from the argument
export function l(a) {
  if (a) {
    return Math.log2(a());
  } else {
    return 0;
  }
}

// Returns agument by its index, e.g. a(2, 4, 5, 6) returns 5 (the 2nd argument)
export function a() {
  var len = arguments.length - 1;
  if (len < 2) {
    return 0;
  } else {
    var i = (Math.floor(arguments[0]()) + len) % len;
    i = (i + len) % len;
    return arguments[i+1]();
  }
}

//
// Music theory helpers
//
const scales = [
  //1, 2, 3, 4, 5, 6, 7
  [0, 2, 4, 5, 7, 9, 11], // major
  [0, 2, 3, 5, 7, 8, 10], // natural minor
  // TODO: more scales
]

// Returns note value from the given scale
export function scale(index, mode, key) {
  let i = arg(mode, 0)
  let len = scales[i].length
  let j = arg(index, 0)
  let transpose = Math.floor(j/len) * 12
  j = Math.floor(j + len) % len
  j = (j + len) % len
  return scales[i][j] + transpose
}

// Returns frequency of the note
export function hz(n) {
  return Math.pow(2, arg(n, 0)/12)*440
}


//
// Sound synthesis
//
function osc(oscillator, freq) {
  if (!freq) {
    oscillator.w = NaN
  } else {
    oscillator.w = (oscillator.w || 0) + freq() / sampleRate
  }
  return oscillator.w
}

// Can be used to reset oscillators and envelopes
export function nan() {
  return NaN
}

export function sin(freq) {
	return denorm(Math.sin(osc(this, freq) * 2 * Math.PI))
}

export function saw(freq) {
  let tau = osc(this, freq)
	return denorm(2 * (tau - Math.round(tau)))
}

export function tri(freq) {
  let tau = osc(this, freq)
	return denorm(1 - 4 * Math.abs(Math.round(tau) - tau))
}

export function sqr(freq, width) {
  let tau = osc(this, freq)
  tau = tau - Math.floor(tau)
	return denorm(tau < arg(width, 0.5) ? 1 : -1)
}

// Switches values at give tempo, NaN is returned when the switch happens
export function seq() {
  this.t = this.t || 0
  let bpm = arg(arguments[0], NaN)
  if (bpm == NaN) {
    return NaN
  } else if (arguments.length > 1) {
    this.t++
    let bps = bpm / 60
    let beat = this.t * bps / sampleRate
    if (beat - Math.floor(beat) < 1/sampleRate) {
      return NaN
    }
    let len = arguments.length - 1
    let i = (Math.floor(beat) + len) % len;
    i = (i + len) % len;
    return arguments[i+1]();
  } else {
    return 0
  }
}

// Slides from one value to another at given tempo, NaN is returned when the switch happens
export function slide() {
  this.t = this.t || 0
  let bpm = arg(arguments[0], NaN)
  if (bpm == NaN) {
    return NaN
  } else if (arguments.length > 1) {
    this.t++
    let bps = bpm / 60
    let beat = this.t * bps / sampleRate
    if (beat == Math.floor(beat)) {
      return NaN
    }
    let len = arguments.length - 1
    let i = (Math.floor(beat) + len) % len;
    i = (i + len) % len;
    let a = arguments[i+1]();
    let b = arguments[(i+1)%len + 1]();
    return (b - a) * (beat - Math.floor(beat)) + a;
  } else {
    return 0
  }
}

// TODO
export function env() {
  this.t = this.t || 0
  // Last argument is signal value
  let v = arg(arguments[arguments.length-1], NaN)
  if (isNaN(v)) {
    this.t = 0
    return NaN
  } else {
    this.t++;
    return v * Math.max(1 - this.t/sampleRate*8, 0)
  }
}

// FM synthesizer, modulators 1 and 2 are chained, modulator 3 is parallel
export function fm(freq, mf1, mi1, mf2, mi2, mf3, mi3) {
  this.w = (freq !== undefined ? ((this.w||0)+1/sampleRate) : 0)
  let tau = this.w * 2 * Math.PI
  let f = arg(freq, 0)
  if (isNaN(f)) {
    this.w = 0
    return NaN
  }
  let a = arg(mi2, 0) * Math.sin(tau * (f * arg(mf2, 0)))
  let b = arg(mi1, 0) * Math.sin(tau * (f * arg(mf1, 0) + a));
  let c = arg(mi3, 0) * Math.sin(tau * (f * arg(mf3, 0)))
	return denorm(Math.sin(tau * (f + c + b)))
}

// modulates signals by multiplying their values, also cuts amplitude to avoid
// overflows
export function am() {
  let v = 256
  for (var i = 0; i < arguments.length; i++) {
    v = v * arguments[i]() / 256
  }
  return Math.max(Math.min(v, 255), 0)
}

// Simple one pole IIR low-pass filter, can be used to construct high-pass and
// all-pass filters as well (hpf=x-lpf(x), apf=hpf-lpf)
export function lpf(x, fc) {
  let wa = Math.tan(Math.PI * arg(fc, 200) / sampleRate);
  let a = wa / (1.0 + wa);
  this.lpf = this.lpf || 0;
  this.lpf = this.lpf + (arg(x, NaN) - this.lpf) * a;
  return this.lpf;
}
