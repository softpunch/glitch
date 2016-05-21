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

