import React from 'react';

import { connect } from 'react-redux';

import { play, setExpr } from '../actions';

import { YELLOW, PINK } from '../colors';

import examples from '../examples';

const libraryStyle = {
  overflowY: 'auto',
  flex: 1,
};

const linkStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

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
  }
  handleClick(expr) {
    this.props.dispatch(setExpr(expr));
    this.props.dispatch(play());
  }
  renderLink(example) {
    return (<Link
      key={example.f}
      expr={example.f}
      active={this.props.expr === example.f}
      color={YELLOW}
      width={this.ellipsisWidth}
      onClick={() => this.handleClick(example.f)}
    />);
  }
  render() {
    const links = examples.map((example) => this.renderLink(example));
    return (<div ref="content" style={libraryStyle}>
      <div style={{ height: (this.ellipsisWidth === 0 ? 0 : `${this.height}px`) }}>
	{links}
      </div>
    </div>);
  }
}
Library.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  expr: React.PropTypes.string.isRequired,
};

function Link(props) {
  let color = YELLOW;
  let mark = '\u00a0';
  if (props.active) {
    color = PINK;
    mark = '\u25b6'; // right-pointing triangle
  }
  const style = Object.assign({}, linkStyle, {
    color,
    width: props.width,
    cursor: 'pointer',
  });
  return (<a {...props} style={style}>{`${mark} ${props.expr}`}</a>);
}
Link.propTypes = {
  active: React.PropTypes.bool.isRequired,
  expr: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
};

export default connect(state => ({ expr: state.expr.expr }))(Library);
