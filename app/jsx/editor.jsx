import React from 'react';
import ReactDOM from 'react-dom';

export default class Editor extends React.Component {
  constructor() {
    super();
    this.handleTextChange = (e) => {
      this.props.glitch.setExpr(e.target.value);
      this.forceUpdate();
    };
  }
  componentDidMount() {
    this.props.glitch.setExpr("(t*((3+(1^t>>10&5))*(5+(3&t>>14))))>>(t>>8&3)");
    this.forceUpdate();
  }
  render() {
    return <textarea
      value={this.props.glitch.input}
      onChange={this.handleTextChange.bind(this)}
      style={{
	flex: '1',
	width: '100%',
	resize: 'none',
	fontSize: '18pt',
      }}/>
  }
}
