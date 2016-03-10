import React from 'react';
import ReactDOM from 'react-dom';

export default class Editor extends React.Component {
  constructor() {
    super();
    this.handleTextChange = (e) => {
      this.props.glitch.compile(e.target.value);
      this.forceUpdate();
    };
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
