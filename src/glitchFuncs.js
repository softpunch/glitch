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
  // 0..6 - classical modes
  [0, 2, 4, 5, 7, 9, 11], // ionian, major scale
  [0, 2, 3, 5, 7, 9, 10], // dorian
  [0, 1, 3, 5, 7, 8, 10], // phrygian
  [0, 2, 4, 6, 7, 9, 11], // lydian
  [0, 2, 4, 5, 7, 9, 10], // mixolydian
  [0, 2, 3, 5, 7, 8, 10], // aeolian, natural minor scale
  [0, 1, 3, 5, 6, 8, 10], // locrian

  // 7..8 - common minor variants
  [0, 2, 3, 5, 7, 8, 11], // harmonic minor scale
  [0, 2, 3, 5, 7, 9, 11], // melodic minor scale

  // 9..13 - pentatonic and other scales
  [0, 2, 4, 7, 9], // major pentatonic
  [0, 3, 5, 7, 10], // minor pentatonic
  [0, 3, 5, 6, 7, 10], // blues
  [0, 2, 4, 6, 8, 10], // whole tone scale
  [0, 1, 3, 4, 6, 7, 9, 10], // octatonic

  // 14 and above - chromatic scale
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // chromatic is a fallback scale
]

// Returns note value from the given scale
export function scale(index, mode, key) {
  let i = Math.min(Math.floor(arg(mode, 0)), scales.length-1)
  if (isNaN(i)) {
    return NaN
  }
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
  oscillator.nextfreq = arg(freq, NaN)
  if (!oscillator.freq) {
    oscillator.freq = oscillator.nextfreq
  }
  let w = oscillator.w || 0
  if (w > 1) {
    w = w - Math.floor(w)
    oscillator.freq = oscillator.nextfreq
  }
  oscillator.w = w + oscillator.freq / sampleRate
  if (isNaN(oscillator.nextfreq)) {
    return NaN
  }
  return w
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
  let tau = osc(this, freq) + 0.25
	return denorm(-1 + 4 * Math.abs(tau - Math.round(tau)))
}

export function sqr(freq, width) {
  let tau = osc(this, freq)
  if (isNaN(tau)) {
    return NaN
  }
  tau = tau - Math.floor(tau)
	return denorm(tau < arg(width, 0.5) ? 1 : -1)
}

// FM synthesizer, modulators 1 and 2 are chained, modulator 3 is parallel
export function fm(freq, mf1, mi1, mf2, mi2, mf3, mi3) {
  this.nextfreq = arg(freq, NaN)
  if (!this.freq) {
    this.freq = this.nextfreq
  }
  this.w = (this.w || 0)
  this.w += 1 / sampleRate
  function modulate(tau, f) {
    let v3 = arg(mi3, 0) * Math.sin(tau * (f * arg(mf3, 0)))
    let v2 = arg(mi2, 0) * Math.sin(tau * (f * arg(mf2, 0) + v3))
    let v1 = arg(mi1, 0) * Math.sin(tau * (f * arg(mf1, 0) + v3));
    return Math.sin(tau * (f + v1 + v2))
  }
  if (isNaN(this.nextfreq)) {
    return NaN
  }
  let tau = this.w * 2 * Math.PI
  let f = this.freq
  if (modulate(tau, this.freq) * modulate(tau + 1/sampleRate, this.freq) <= 0) {
    this.w = this.w - Math.floor(this.w)
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
  let len = args.length - 1
  if (len <= 0) {
    return (seq.t === 0 ? NaN : 0)
  }
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

// env()             -> 0
// env(x)            -> x
// env(r, x)         -> percussive
// env(a, r, x)      -> percussive
// env(a, segmentDuration, segmentAmplitude, ...,  x)
export function env() {
  // Zero arguments = zero signal level
  // One argument = unmodied signal value
  if (arguments.length < 2) {
    return arg(arguments[0], 128)
  }
  // Last argument is signal value
  let v = arg(arguments[arguments.length-1], NaN)
  // Update envelope
  this.e = this.e || []
  this.d = this.d || []
  this.segment = this.segment || 0
  this.t = this.t || 0
  if (arguments.length == 2) {
    this.d[0] = 0.0625 * sampleRate
    this.e[0] = 1
    this.d[1] = arg(arguments[0], NaN) * sampleRate
    this.e[1] = 0
  } else {
    this.d[0] = arg(arguments[0], NaN) * sampleRate
    this.e[0] = 1
    for (var i = 1; i < arguments.length - 1; i = i + 2) {
      this.d[(i-1)/2+1] = arg(arguments[i], NaN) * sampleRate
      if (i + 1 < arguments.length - 1) {
        this.e[(i-1)/2+1] = arg(arguments[i+1], NaN)
      } else {
        this.e[(i-1)/2+1] = 0
      }
    }
  }
  if (isNaN(v)) {
    this.segment = 0
    this.t = 0
    return NaN
  } else {
    this.t++;
    if (this.t > this.d[this.segment]) {
      this.t = 0
      this.segment++
    }
    if (this.segment >= this.e.length) {
      return 128 // end of envelope
    }
    let prevAmp = (this.segment == 0 ? 0 : this.e[this.segment-1])
    let amp = this.e[this.segment]
    return (v - 128) * (prevAmp + (amp - prevAmp) * (this.t / this.d[this.segment])) + 128
  }
}

// mixes signals and cuts amplitude to avoid overflows
export function mix() {
  let v = 0
  this.lastSamples = this.lastSamples || {}
  for (var i = 0; i < arguments.length; i++) {
    let sample = arguments[i]()
    if (isNaN(sample)) {
      sample = this.lastSamples[i]||0
    } else {
      this.lastSamples[i] = sample
    }
    v = v + (sample - 128) / 127
  }
  if (arguments.length > 0) {
    v = v / Math.sqrt(arguments.length)
    return denorm(Math.max(Math.min(v, 1), -1))
  } else {
    return 128
  }
}

// Simple one pole IIR low-pass filter, can be used to construct high-pass and
// all-pass filters as well (hpf=x-lpf(x), apf=hpf-lpf)
export function lpf(x, fc) {
  let cutoff = arg(fc, 200)
  let value = arg(x, NaN)
  if (isNaN(value) || isNaN(cutoff)) {
    return NaN
  }
  let wa = Math.tan(Math.PI * arg(fc, 200) / sampleRate);
  let a = wa / (1.0 + wa);
  this.lpf = this.lpf || 128;
  this.lpf = this.lpf + (value - this.lpf) * a;
  return this.lpf;
}
