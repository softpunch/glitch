// Returns buffer filled with WAV samples of the given length produced by the
// given function
export function waveFile(sec, sampleRate, f) {
  var length = sec * sampleRate;
  var intBuffer = new Int16Array(length + 23), tmp;
  intBuffer[0] = 0x4952; // "RI"
  intBuffer[1] = 0x4646; // "FF"
  intBuffer[2] = (2*length + 15) & 0x0000ffff; // RIFF size
  intBuffer[3] = ((2*length + 15) & 0xffff0000) >> 16; // RIFF size
  intBuffer[4] = 0x4157; // "WA"
  intBuffer[5] = 0x4556; // "VE"
  intBuffer[6] = 0x6d66; // "fm"
  intBuffer[7] = 0x2074; // "t "
  intBuffer[8] = 0x0012; // fmt chunksize: 18
  intBuffer[9] = 0x0000; //
  intBuffer[10] = 0x0001; // format tag : 1 
  intBuffer[11] = 1;     // channels: 1
  intBuffer[12] = sampleRate & 0x0000ffff; // sample per sec
  intBuffer[13] = (sampleRate & 0xffff0000) >> 16; // sample per sec
  intBuffer[14] = (2*sampleRate) & 0x0000ffff; // byte per sec
  intBuffer[15] = ((2*sampleRate) & 0xffff0000) >> 16; // byte per sec
  intBuffer[16] = 0x0004; // block align
  intBuffer[17] = 0x0010; // bit per sample
  intBuffer[18] = 0x0000; // cb size
  intBuffer[19] = 0x6164; // "da"
  intBuffer[20] = 0x6174; // "ta"
  intBuffer[21] = (2*length) & 0x0000ffff; // data size[byte]
  intBuffer[22] = ((2*length) & 0xffff0000) >> 16; // data size[byte]  

  for (var i = 0; i < length; i++) {
    intBuffer[i+23] = Math.round(f(i) * (1 << 15));
  }
  return intBuffer.buffer;
}

// Simulates clicking on a link to initiate file saving
export function saveFile(name, data, contentType) {
  console.log(name, data, contentType)
  let blob = new Blob([data], {type: contentType});
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
