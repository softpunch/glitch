class AudioContext {
  constructor() {
    this.sampleRate = 44100
  }
  createAnalyser() {
    return new Analyser()
  }
  createScriptProcessor() {
    return {}
  }
}

class Analyser {
  connect() {}
}

global.AudioContext = AudioContext
