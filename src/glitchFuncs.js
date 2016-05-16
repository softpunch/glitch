export function s(a) {
  if (a) {
    return Math.sin(a()*Math.PI/128)*127+128;
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

