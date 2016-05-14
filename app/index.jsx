import './index.html';
import 'font-awesome/css/font-awesome.css';
import './favicon.png';
import './glitch180x180.png';
import './glitch192x192.png';
import './styles.css';
import './roboto.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Glitch from './glitch.js';

import App from './jsx/app.jsx';

var glitch;

window.onload = function() {
  try {
    glitch = new Glitch();
    console.log('hash is', window.location.hash);
    if (window.location.hash) {
      glitch.compile(decodeURIComponent(window.location.hash.substring(1)));
    } else {
      glitch.compile("(t*((3+(1^t>>10&5))*(5+(3&t>>14))))>>(t>>8&3)");
    }
  } catch(e) {
    console.log(e);
  }

  ReactDOM.render(<App glitch={glitch} />, document.getElementById('container'));
};
