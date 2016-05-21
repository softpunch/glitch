import assert from 'assert';

import './mockAudio'
import {sampleRate} from '../src/audio'
import * as funcs from '../src/glitchFuncs'

function n(x) {
  return function() {
    return x
  }
}

describe('Audio mock', function() {
  it('sample rate should be set to 44100', function() {
    assert.equal(sampleRate, 44100);
  })
})

describe('Glitch utils: s()', function() {
  it('s() returns denormalized sine wave', function() {
    assert.equal(funcs.s(n(0)), 128)
    assert.equal(funcs.s(n(64)), 255)
    assert.equal(Math.round(funcs.s(n(128))), 128)
    assert.equal(Math.round(funcs.s(n(192))), 1)
  })
  it('s() is periodic', function() {
    assert.equal(Math.round(funcs.s(n(256))), 128)
    assert.equal(Math.round(funcs.s(n(512))), 128)
    assert.equal(Math.round(funcs.s(n(1024))), 128)
  })
  it('s() without args equals s(0)', function() {
    assert.equal(funcs.s(), funcs.s(n(0)))
  })
  it('s(NaN) equals NaN', function() {
    assert(isNaN(funcs.s(n(NaN))))
  })
})

describe('Glitch utils: r()', function() {
  it('r() returns random numbers', function() {
    let a = funcs.r()
    let b = funcs.r()
    assert.notEqual(a, b)
  })
  it('r() returns random numbers in the given range', function() {
    for (let i = 1; i < 1000; i++) {
      let r = funcs.r(n(i))
      assert(r >= 0, 'r >= 0')
      assert(r < i, 'r < i')
    }
  })
  it('r(0) returns zero', function() {
    assert.equal(funcs.r(n(0)), 0)
  })
  it('r(NaN) returns NaN', function() {
    assert(isNaN(funcs.r(n(NaN))))
  })
  it('r() without arguments returns random numbers in the range [0..255]', function() {
    let r = funcs.r()
    assert(r >= 0, 'r >= 0')
    assert(r < 255, 'r < 255')
  })
})

describe('Glitch utils: nan()', function() {
  it('nan() returns NaN', function() {
    assert(isNaN(funcs.nan()))
    assert(isNaN(funcs.nan(n(0))))
    assert(isNaN(funcs.nan(n(123))))
  })
})

describe('Glitch utils: l()', function() {
  it('l() returns log2', function() {
    assert.equal(funcs.l(n(2)), 1)
    assert.equal(funcs.l(n(4)), 2)
    assert.equal(funcs.l(), 0)
    assert(isNaN(funcs.l(n(NaN))))
  })
})

describe('Glitch utils: hz()', function() {
  it('hz() returns note frequency in hz', function() {
    assert.equal(funcs.hz(n(0)), 440)
    assert.equal(Math.round(funcs.hz(n(1))), 466)
    assert.equal(funcs.hz(n(12)), 880)
  })
  it('hz() without arguments returns 400 hz', function() {
    assert.equal(funcs.hz(), 440)
  })
  it('hz(NaN) returns NaN', function() {
    assert(isNaN(funcs.hz(n(NaN))))
  })
})

describe('Glitch utils: scale()', function() {
  // TODO: write tests after all basic scales are added
})

describe('Glitch sequencer: a()', function() {
  it('a() returns element from the list of arguments at given index', function() {
    assert.equal(funcs.a(n(0), n(4), n(5), n(6)), 4)
    assert.equal(funcs.a(n(1), n(4), n(5), n(6)), 5)
    assert.equal(funcs.a(n(2), n(4), n(5), n(6)), 6)
  })
  it('a() positive index overflows', function() {
    assert.equal(funcs.a(n(3), n(4), n(5), n(6)), 4)
    assert.equal(funcs.a(n(4), n(4), n(5), n(6)), 5)
    assert.equal(funcs.a(n(5), n(4), n(5), n(6)), 6)
  })
  it('a() floors floating point index', function() {
    assert.equal(funcs.a(n(3.0), n(4), n(5), n(6)), 4)
    assert.equal(funcs.a(n(3.1), n(4), n(5), n(6)), 4)
    assert.equal(funcs.a(n(3.99), n(4), n(5), n(6)), 4)
  })
  it('a() negative index overflows', function() {
    assert.equal(funcs.a(n(-3), n(4), n(5), n(6)), 4)
    assert.equal(funcs.a(n(-2), n(4), n(5), n(6)), 5)
    assert.equal(funcs.a(n(-1), n(4), n(5), n(6)), 6)
    assert.equal(funcs.a(n(-100), n(4), n(5), n(6)), 6)
  })
  it('a() without arguments returns zero', function() {
    assert.equal(funcs.a(), 0)
  })
  it('a() with no elements returns zero', function() {
    assert.equal(funcs.a(n(0)), 0)
    assert.equal(funcs.a(n(1000)), 0)
    assert.equal(funcs.a(n(-1000)), 0)
  })
  it('a() can return NaN', function() {
    let x = funcs.a(n(1), n(1), n(NaN), n(2))
    assert(isNaN(funcs.a(n(1), n(1), n(NaN), n(2))))
  })
  it('a() returns NaN if index is NaN', function() {
    assert(isNaN(funcs.a(n(NaN)), n(1), n(2), n(3)))
    assert(isNaN(funcs.a(n(NaN))))
  })
})

describe('Glitch sequencer: loop()', function() {
  it('produces NaN on each beat evaluating current step once per beat', function() {
    let loop = funcs.loop.bind({})
    let i = 0
    let incr = function() {
      return i++
    }
    let bpm = sampleRate * 60 / 4
    assert(isNaN(loop(n(bpm), incr, n(2))), '1/4+0')
    assert.equal(loop(n(bpm), incr, n(2)), 1, '2/4+0')
    assert.equal(loop(n(bpm), incr, n(2)), 2, '3/4+0')
    assert.equal(loop(n(bpm), incr, n(2)), 3, '4/4+0')
    assert(isNaN(loop(n(bpm), incr, n(2))), '1/4+1')
    assert.equal(loop(n(bpm), incr, n(2)), 2, '2/4+1')
    assert.equal(loop(n(bpm), incr, n(2)), 2, '3/4+1')
    assert.equal(loop(n(bpm), incr, n(2)), 2, '4/4+1')
    assert(isNaN(loop(n(bpm), incr, n(2))), '1/4+2')
    assert.equal(loop(n(bpm), incr, n(2)), 5, '2/4+2')
    assert.equal(loop(n(bpm), incr, n(2)), 6, '3/4+2')
    assert.equal(loop(n(bpm), incr, n(2)), 7, '4/4+2')
    assert(isNaN(loop(n(bpm), incr, n(2))), '1/4+3')
  })
})

describe('Glitch sequencer: seq()', function() {
  it('produces NaN on each beat evaluating current step on each call', function() {
    let seq = funcs.seq.bind({})
    let i = 0
    let incr = function() {
      return i++
    }
    let bpm = sampleRate * 60 / 4
    assert(isNaN(seq(n(bpm), incr, n(2))), '1/4+0')
    assert.equal(seq(n(bpm), incr, n(2)), 0, '2/4+0')
    assert.equal(seq(n(bpm), incr, n(2)), 0, '3/4+0')
    assert.equal(seq(n(bpm), incr, n(2)), 0, '4/4+0')
    assert(isNaN(seq(n(bpm), incr, n(2))), '1/4+1')
    assert.equal(seq(n(bpm), incr, n(2)), 2, '2/4+1')
    assert.equal(seq(n(bpm), incr, n(2)), 2, '3/4+1')
    assert.equal(seq(n(bpm), incr, n(2)), 2, '4/4+1')
    assert(isNaN(seq(n(bpm), incr, n(2))), '1/4+2')
    assert.equal(seq(n(bpm), incr, n(2)), 1, '2/4+2')
    assert.equal(seq(n(bpm), incr, n(2)), 1, '3/4+2')
    assert.equal(seq(n(bpm), incr, n(2)), 1, '4/4+2')
  })
})

describe('Glitch sequencer: slide()', function() {
  it('produces NaN on each beat sliding step value from one to another', function() {
    let slide = funcs.slide.bind({})
    let i = 0
    let incr = function() {
      return i++
    }
    let bpm = sampleRate * 60 / 4
    assert(isNaN(slide(n(bpm), incr, n(2))), '1/4+0')
    assert.equal(slide(n(bpm), incr, n(2)), 0.5, '2/4+0')
    assert.equal(slide(n(bpm), incr, n(2)), 1, '3/4+0')
    assert.equal(slide(n(bpm), incr, n(2)), 1.5, '4/4+0')
    assert(isNaN(slide(n(bpm), incr, n(2))), '1/4+1')
    assert.equal(slide(n(bpm), incr, n(2)), 1.75, '2/4+1')
    assert.equal(slide(n(bpm), incr, n(2)), 1.5, '3/4+1')
    assert.equal(slide(n(bpm), incr, n(2)), 1.25, '4/4+1')
    assert(isNaN(slide(n(bpm), incr, n(2))), '1/4+2')
  })
})

describe('Glitch instrument: sin()', function() {
  it('produces sine wave of the given frequency with amplitude 0..255', function() {
    let sin = funcs.sin.bind({})
    let freq = n(sampleRate/4)
    let values = [128, 255, 128, 1, 128, 255, 128, 1]
    for (let gain of values) {
      let v = Math.round(sin(freq))
      assert.equal(v, gain)
    }
  })
  it('returns NaN when frequency is NaN', function() {
    let sin = funcs.sin.bind({})
    assert(isNaN(sin(n(NaN))))
  })
  it('applies frequency change on the next cycle', function() {
    // TODO
  })
})

describe('Glitch instrument: tri()', function() {
  it('produces triangular wave of the given frequency with amplitude 0..255', function() {
    let tri = funcs.tri.bind({})
    let freq = n(sampleRate/4)
    let values = [128, 255, 128, 1, 128, 255, 128, 1]
    for (let gain of values) {
      let v = Math.round(tri(freq))
      assert.equal(v, gain)
    }
  })
  it('returns NaN when frequency is NaN', function() {
    let tri = funcs.tri.bind({})
    assert(isNaN(tri(n(NaN))))
  })
  it('applies frequency change on the next cycle', function() {
    // TODO
  })
})

describe('Glitch instrument: saw()', function() {
  it('produces sawtooth wave of the given frequency with amplitude 0..255', function() {
    let saw = funcs.saw.bind({})
    let freq = n(sampleRate/4)
    let values = [128, 192, 1, 65, 128, 192, 1, 65]
    for (let gain of values) {
      let v = Math.round(saw(freq))
      assert.equal(v, gain)
    }
  })
  it('returns NaN when frequency is NaN', function() {
    let saw = funcs.saw.bind({})
    assert(isNaN(saw(n(NaN))))
  })
  it('applies frequency change on the next cycle', function() {
    // TODO
  })
})

describe('Glitch instrument: sqr()', function() {
  it('produces square wave of the given frequency with amplitude 0..255', function() {
    let sqr = funcs.sqr.bind({})
    let freq = n(sampleRate/4)
    let values = [255, 255, 1, 1, 255, 255, 1, 1]
    for (let gain of values) {
      let v = Math.round(sqr(freq))
      assert.equal(v, gain)
    }
  })
  it('produces square wave of custom width', function() {
    let sqr = funcs.sqr.bind({})
    let freq = n(sampleRate/4)
    let values = [255, 255, 255, 1, 255, 255, 255, 1]
    for (let gain of values) {
      let v = Math.round(sqr(freq, n(0.75)))
      assert.equal(v, gain)
    }
  })
  it('returns NaN when frequency is NaN', function() {
    let sqr = funcs.sqr.bind({})
    assert(isNaN(sqr(n(NaN))))
  })
  it('applies frequency change on the next cycle', function() {
    // TODO
  })
})

describe('Glitch instrument: fm()', function() {
})

describe('Glitch effect: env()', function() {
})

describe('Glitch effect: am()', function() {
})

describe('Glitch effect: lpf()', function() {
  it('modifies signal', function() {
    let sin = funcs.sin.bind({})
    let lpf = funcs.lpf.bind({})
    let f = n(40)
    let cutoff = n(10000)
    let err = 0
    for (let i = 0; i < 1000; i++) {
      let signal = sin(f)
      err = err + Math.abs(lpf(n(signal), cutoff) - signal)
    }
    assert(err > 0)
  })
  it('distorts signal depending on cutoff frequency', function() {
    let sin = funcs.sin.bind({})
    let lpf1 = funcs.lpf.bind({})
    let lpf2 = funcs.lpf.bind({})
    let f = n(120)
    let cutoff1 = n(1000)
    let cutoff2 = n(100)
    let err1 = 0
    let err2 = 0
    for (let i = 0; i < 1000; i++) {
      let signal = sin(f)
      err1 = err1 + Math.abs(lpf1(n(signal), cutoff1) - signal)
      err2 = err2 + Math.abs(lpf2(n(signal), cutoff2) - signal)
    }
    assert(err2 > err1)
  })
  it('mutes signal when cutoff frequency is zero', function() {
    let sin = funcs.sin.bind({})
    let lpf = funcs.lpf.bind({})
    let f = n(440)
    let cutoff = n(0)
    for (let i = 0; i < 1000; i++) {
      assert.equal(lpf(n(sin(f)), cutoff), 0)
    }
  })
})

