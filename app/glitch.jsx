import expr from './expr';

var FUNCS = {
  's': function(a) {
    if (a) {
      return Math.sin(a());
    } else {
      return 0;
    }
  },
  'r': function() {
    return Math.random();
  },
  'l': function(a) {
    if (a) {
      return Math.log2(a());
    } else {
      return 0;
    }
  },
  'a': function() {
    var len = arguments.length;
    if (len < 2) {
      return 0;
    } else {
      var i = (Math.floor(arguments[0]()) + len) % len;
      i = (i + len) % len;
      return arguments[i]();
    }
  },
}

export default class Glitch {
  constructor() {
    var bufsz = 2*4096;

    this.playing = false;
    this.vars = {'t': expr.varExpr(0), 'r': expr.varExpr(0)};
    this.expr = expr.parse('', this.vars, FUNCS);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audio = new AudioContext();
    this.sampleRate = this.audio.sampleRate;
    this.sampleStep = 8000.0 / this.sampleRate;

    this.analyser = this.audio.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0;
    var len = this.analyser.frequencyBinCount;
    this.analyserFreq = new Uint8Array(len);
    this.analyserTime = new Uint8Array(len);
    this.renderNode = this.audio.createScriptProcessor(bufsz, 0, 1);
    this.renderNode.onaudioprocess = (e) => {
      this.analyser.getByteFrequencyData(this.analyserFreq);
      this.analyser.getByteTimeDomainData(this.analyserTime);
    }
    this.renderNode.connect(this.audio.destination);
    this.analyser.connect(this.renderNode);
    this.analyser.connect(this.audio.destination);

    this.pcmNode = this.audio.createScriptProcessor(bufsz, 0, 1);
    this.pcmNode.onaudioprocess = (e) => {
      var out = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < out.length; i++) {
        var v = this.expr();
        out[i] = (v&0xff)/0x80 - 1;
        this.vars.r(this.vars.r()+1);
        this.vars.t(Math.round(this.vars.r()*this.sampleStep));
      }
    }

    this.delay = this.audio.createDelay(0.5);
    this.delay.connect(this.analyser);
    this.delay.value = 0;

    this.lp = this.audio.createBiquadFilter();
    this.lp.connect(this.delay);
    this.lp.connect(this.analyser);
    this.lp.frequency.value = 1000;
    this.lp.gain.value = 0;
    this.lp.type = 'lowshelf';

    this.hp = this.audio.createBiquadFilter();
    this.hp.connect(this.lp);
    this.hp.frequency.value = 1000;
    this.hp.gain.value = 0;
    this.hp.type = 'highshelf';
  }
  togglePlayback() {
    if (this.playing) {
      for (var v in this.vars) {
        if (this.vars.hasOwnProperty(v)) {
          delete this.vars[v];
        }
      }
      this.vars.t = expr.varExpr(0);
      this.vars.r = expr.varExpr(0);
      this.pcmNode.disconnect();
    } else {
      this.pcmNode.connect(this.hp);
    }
    this.playing = !this.playing;
  }
  setExpr(s) {
    var e = expr.parse(s, this.vars, FUNCS);
    if (e) {
      this.error = undefined;
      this.expr = e;
    } else {
      this.error = true;
    }
  }
}

