const audioContext = new AudioContext()
const AUDIO_BUFFER_SIZE = 4096

export const sampleRate = audioContext.sampleRate

const pcmNode = audioContext.createScriptProcessor(AUDIO_BUFFER_SIZE, 0, 1);

export const analyser = audioContext.createAnalyser()

analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0;
analyser.connect(audioContext.destination);
pcmNode.onaudioprocess = undefined;

export function play(audioCallback) {
  if (!pcmNode.onaudioprocess) {
    pcmNode.connect(analyser);
    pcmNode.onaudioprocess = audioCallback;
  }
}

export function stop() {
  if (pcmNode.onaudioprocess) {
    pcmNode.disconnect();
    pcmNode.onaudioprocess = undefined;
  }
}

