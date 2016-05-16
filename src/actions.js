// Action types
export const SET_EXPR = 'SET_EXPR'
export const ERROR = 'ERROR'
export const PLAY = 'PLAY'
export const STOP = 'STOP'
export const EXPORT_WAV = 'EXPORT_WAV'
export const NAVIGATE = 'NAVIGATE'

function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

export const setExpr = makeActionCreator(SET_EXPR, 'expr');
export const error = makeActionCreator(ERROR, 'error')
export const play = makeActionCreator(PLAY);
export const stop = makeActionCreator(STOP);
export const exportWav = makeActionCreator(EXPORT_WAV);
export const navigate = makeActionCreator(NAVIGATE, 'tab');
