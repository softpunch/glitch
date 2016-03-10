import './index.html';
import 'font-awesome/css/font-awesome.css';
import './styles.css';
import './roboto.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Glitch from './glitch.jsx';
import App from './jsx/app.jsx';

var glitch;

try {
  glitch = new Glitch();
  glitch.compile("(t*((3+(1^t>>10&5))*(5+(3&t>>14))))>>(t>>8&3)");
} catch(e) {
  console.log(e);
}

window.onhashchange = () => {
  if (glitch) {
    glitch.compile(decodeURIComponent(window.location.hash.substring(1)));
  }
};

ReactDOM.render(<App glitch={glitch} />, document.getElementById('container'));

