import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'

import { play, setExpr } from '../actions'

import {YELLOW, GRAY, WHITE, PINK} from '../colors'

import examples from '../examples'

const libraryStyle = {
  overflowY: 'auto',
  flex: 1,
}

const linkStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}

class Library extends React.Component {
  constructor() {
    super();
    this.ellipsisWidth = 0;
    this.onresize = this.onresize.bind(this);
  }
  componentDidMount() {
    this.onresize();
    window.addEventListener('resize', this.onresize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onresize);
  }
  onresize() {
    this.width = this.refs.content.offsetWidth;
    this.height = this.refs.content.offsetHeight;
    this.ellipsisWidth = this.width * 0.9;
    this.forceUpdate();
    console.log(this.width, this.height);
  }
  handleClick(expr) {
    this.props.dispatch(setExpr(expr))
    this.props.dispatch(play())
  }
  render() {
    var results = examples.map((example, i) => this.renderLink(example))
    return <div ref="content" style={libraryStyle}>
      <div style={{height: this.ellipsisWidth == 0 ? '0' : (this.height + 'px')}}>
	{results}
      </div>
    </div>
  }
  renderLink(example) {
    if (this.props.expr.expr == example.f) {
      return <a onClick={this.handleClick.bind(this, example.f)}
	style={Object.assign({width: this.ellipsisWidth + 'px', color: PINK}, linkStyle)}>
	▶ {example.f}
      </a>
    } else {
      return <a onClick={this.handleClick.bind(this, example.f)}
	style={Object.assign({color: YELLOW}, linkStyle, {width: this.ellipsisWidth + 'px'})}>
	&nbsp; {example.f}
      </a>
    }
  }
}

export default connect(state => ({expr: state.expr}))(Library)
