import * as actions from './actions'

const defaultExpr = '(t*((3+(1^t>>10&5))*(5+(3&t>>14))))>>(t>>8&3)';

export const playbackMode = {
  STOPPED: 'stopped',
  PLAYING: 'playing',
}

export const tab = {
  EDITOR: 'EDITOR',
  LIBRARY: 'LIBRARY',
  HELP: 'HELP',
}

export function expr(state = {expr: defaultExpr, error: undefined}, action) {
  switch (action.type) {
    case actions.SET_EXPR: return Object.assign({}, state, {expr: action.expr})
    case actions.ERROR: return Object.assign({}, state, {error: action.error})
    default: return state
  }
}

export function playback(state = {mode: playbackMode.STOPPED}, action) {
  switch (action.type) {
    case actions.PLAY: return Object.assign({}, state, {mode: playbackMode.PLAYING})
    case actions.STOP: return Object.assign({}, state, {mode: playbackMode.STOPPED})
    default: return state
  }
}

export function navigation(state = {tab: tab.EDITOR}, action) {
  if (action.type == actions.NAVIGATE && tab[action.tab]) {
    return Object.assign({}, state, {tab: action.tab})
  }
  return state;
}

