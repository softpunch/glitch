// Importing assets: HTML, CSS and fonts
import './index.html';
import './favicon.png';
import './glitch180x180.png';
import './glitch192x192.png';
import 'font-awesome/css/font-awesome.css';
import './styles.css';
import './roboto.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import Layout from './jsx/Layout'
import { expr, playback, navigation } from './reducers'

import * as actions from './actions'
import * as audio from './audio'
import {saveFile, waveFile} from './save'

import Glitch from './glitch'

const glitch = new Glitch(audio.sampleRate)

// Calls audio service on PLAY and STOP actions
const audioMiddleware = store => next => action => {
  switch (action.type) {
    case actions.PLAY: glitch.reset(); audio.play(glitch.onaudioprocess.bind(glitch)); break;
    case actions.STOP: audio.stop(); break;
    case actions.SET_EXPR:
      if (!glitch.compile(action.expr)) {
        console.log('syntax error')
        store.dispatch(actions.error('syntax error'))
      } else {
        store.dispatch(actions.error())
      }
      break;
    case actions.EXPORT_WAV:
      let glitchRenderer = new Glitch(audio.sampleRate)
      glitchRenderer.compile(store.getState().expr.expr)
      saveFile('glitch.wav',
               waveFile(30, audio.sampleRate, glitchRenderer.nextSample.bind(glitchRenderer)),
               'audio/wav')
      break;
  }
  return next(action)
}

// Changes location URI hash whenever expression is changed
const uriMiddleware = store => next => action => {
  let res = next(action)
  if (!store.getState().expr.error) {
    window.location.hash = encodeURIComponent(store.getState().expr.expr)
  }
  return res;
}

const store = createStore(combineReducers({
  expr,
  playback,
  navigation,
}), applyMiddleware(
  audioMiddleware,
  uriMiddleware
));

// Initialize glitch with default/current expression
if (window.location.hash) {
  store.dispatch(actions.setExpr(decodeURIComponent(window.location.hash.substring(1))))
} else {
  store.dispatch(actions.setExpr(store.getState().expr.expr))
}

document.onmousemove = function(e) {
  glitch.vars.x(e.pageX)
  glitch.vars.y(e.pageY)
}

window.onload = function() {
  ReactDOM.render(<Provider store={store}><Layout /></Provider>,
                  document.getElementById('container'));
}
