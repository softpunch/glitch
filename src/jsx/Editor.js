import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'

import {YELLOW, GRAY, WHITE} from '../colors'

import { setExpr } from '../actions'

const editorStyle = {
  flex: '1',
  width: '100%',
  resize: 'none',
  fontSize: '18pt',
  border: 'none',
  outline: 'none',
  color: WHITE,
  backgroundColor: GRAY,
  fontFamily: 'Roboto Mono, monospace',
  //whiteSpace: 'pre',
  //wordWrap: 'break-word',
}

class Editor extends React.Component {
  handleTextChange(e) {
    this.props.dispatch(setExpr(e.target.value));
  }
  render() {
    return <textarea
      value={this.props.expr.expr}
      onChange={this.handleTextChange.bind(this)}
      style={editorStyle} />
  }
}

function mapStateToProps(state) {
  return {expr: state.expr}
}

export default connect(mapStateToProps)(Editor)

