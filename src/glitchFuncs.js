import {sampleRate} from './audio'

function denorm(x) {
  return x * 127 + 128
}

export function s(a) {
  if (a) {
    return denorm(Math.sin(a()*Math.PI/128))
  } else {
    return 0;
  }
}

export function r() {
  return Math.random()*255;
}

export function l(a) {
  if (a) {
    return Math.log2(a());
  } else {
    return 0;
  }
}

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

export function sin(freq) {
  this.w = (this.w||0) + 1;
  let tau = this.w / sampleRate * freq()
	return denorm(Math.sin(tau * 2 * Math.PI))
}

export function saw(freq) {
  this.w = (this.w||0) + 1
  let tau = this.w / sampleRate * freq()
	return denorm(2 * (tau - Math.round(tau)))
}

export function tri(freq) {
  this.w = (this.w||0) + 1
  let tau = this.w / sampleRate * freq()
	return denorm(1 - 4 * Math.abs(Math.round(tau) - tau))
}

export function sqr(freq, width) {
  this.w = (this.w||0) + 1
  let tau = this.w / sampleRate * freq()
  tau = tau - Math.floor(tau)
  var w
  if (width == undefined) {
    w = 0.5
  } else {
    w = width()
  }
	return denorm(tau < w ? 1 : -1)
}

export function fm(freq, mf1, mi1, mf2, mi2, mf3, mi3) {
  this.w = (this.w||0) + 1
  let tau = this.w / sampleRate
  let f = freq()
  let f1 = mf1 ? mf1() : 0
  let i1 = mi1 ? mi1() : 0
  let f2 = mf2 ? mf2() : 0
  let i2 = mi2 ? mi2() : 0
  let f3 = mf2 ? mf2() : 0
  let i3 = mi2 ? mi2() : 0
	let n = i1 * Math.sin(tau * (f * f1 + i2 * Math.sin(tau*f*f2)))
	let m = i3 * Math.sin(tau * f3) + n
	return denorm(Math.sin(tau * (f + m)))
}
