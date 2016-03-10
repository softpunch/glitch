import './index.html';
import 'font-awesome/css/font-awesome.css';
import './roboto.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Glitch from './glitch.jsx';
import App from './jsx/app.jsx';

var glitch;

try {
  glitch = new Glitch();
} catch(e) {
  console.log(e);
}

ReactDOM.render(<App glitch={glitch} />, document.getElementById('container'));

