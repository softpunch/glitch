import {sampleRate} from './audio'

function denorm(x) {
  return x * 128 + 127
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
  return denorm(Math.sin(arg(a, 0)*Math.PI/128))
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
export function a(index) {
  if (arguments.length == 0) {
    return 0;
  }
  let i = arguments[0]()
  if (isNaN(i)) {
    return NaN
  }
  let len = arguments.length - 1;
  if (len == 0) {
    return 0
  }
  i = Math.floor(i + len) % len;
  i = (i + len) % len;
  return arguments[i+1]();
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
    oscillator.nextfreq = freq()
    if (!oscillator.freq) {
      oscillator.freq = oscillator.nextfreq
    }
    oscillator.w = (oscillator.w || 0)
    oscillator.w += oscillator.freq / sampleRate
    if (oscillator.w > 1) {
      oscillator.w = oscillator.w - Math.floor(oscillator.w)
      oscillator.freq = oscillator.nextfreq
    }
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

// FM synthesizer, modulators 1 and 2 are chained, modulator 3 is parallel
export function fm(freq, mf1, mi1, mf2, mi2, mf3, mi3) {
  if (!freq) {
    return NaN
  }
  this.nextfreq = freq()
  if (!this.freq) {
    this.freq = this.nextfreq
  }
  this.w = (this.w || 0)
  this.w += 1 / sampleRate
  function modulate(tau, f) {
    let a = arg(mi2, 0) * Math.sin(tau * (f * arg(mf2, 0)))
    let b = arg(mi1, 0) * Math.sin(tau * (f * arg(mf1, 0) + a));
    let c = arg(mi3, 0) * Math.sin(tau * (f * arg(mf3, 0)))
    return Math.sin(tau * (f + c + b))
  }

  let tau = this.w * 2 * Math.PI
  let f = this.freq
  if (modulate(tau, this.freq) * modulate(tau + 1/sampleRate, this.freq) <= 0) {
    //this.w = this.w - Math.floor(this.w)
    this.freq = this.nextfreq
  }
	return denorm(modulate(tau, this.freq))
}


// Switches values at give tempo, NaN is returned when the switch happens
function next(args, seq, f) {
  let beatDuration = sampleRate / (arg(args[0], NaN) / 60)
  if (beatDuration == NaN) {
    return NaN
  }
  seq.t = (seq.t+1) || beatDuration
  if (seq.t >= beatDuration) {
    seq.t = 0
    seq.beat = (seq.beat !== undefined ? seq.beat+1 : 0)
  }
  if (args.length == 0) {
    return 0
  }
  let len = args.length - 1
  let i = (Math.floor(seq.beat) + len) % len;
  i = (i + len) % len;
  return f(args, i, seq.t/beatDuration)
}

// Switches values evaluating the current value on each call
export function loop() {
  return next(arguments, this, (a, i, offset) => {
    let res = a[i+1]()
    return offset === 0 ? NaN : res
  })
}

// Switches values evaluating them once per beat
export function seq() {
  return next(arguments, this, (a, i, offset) => {
    if (offset === 0) {
      this.value = a[i+1]()
      return NaN
    }
    return this.value
  })
}

// Slides from one value to another at given tempo, NaN is returned when the switch happens
export function slide() {
  let len = arguments.length - 1
  return next(arguments, this, (a, i, offset) => {
    if (offset === 0) {
      let j = (i+1)%len
      if (this.value === undefined) {
        this.value = a[i+1]()
      } else {
        this.value = this.nextvalue
      }
      this.nextvalue = a[j+1]()
      return NaN
    }
    return (this.nextvalue - this.value) * (offset) + this.value;
  })
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
    return (v - 127 ) * Math.max(1 - this.t/sampleRate*4, 0) + 127
  }
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
