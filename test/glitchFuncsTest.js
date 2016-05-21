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
    assert.equal(funcs.s(n(0)), 127)
    assert.equal(funcs.s(n(64)), 255)
    assert.equal(Math.round(funcs.s(n(128))), 127)
    assert.equal(Math.round(funcs.s(n(196))), 0)
  })
  it('s() is periodic', function() {
    assert.equal(Math.round(funcs.s(n(256))), 127)
    assert.equal(Math.round(funcs.s(n(512))), 127)
    assert.equal(Math.round(funcs.s(n(1024))), 127)
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

})

describe('Glitch sequencer: seq()', function() {

})

describe('Glitch sequencer: slide()', function() {

})

describe('Glitch instrument: sin()', function() {
})

describe('Glitch instrument: tri()', function() {
})

describe('Glitch instrument: saw()', function() {
})

describe('Glitch instrument: sqr()', function() {
})

describe('Glitch instrument: fm()', function() {
})

describe('Glitch effect: env()', function() {
})

describe('Glitch effect: am()', function() {
})

describe('Glitch effect: lpf()', function() {
})

describe('Glitch effect: hpf()', function() {
})

