import React from 'react';
import ReactDOM from 'react-dom';

import Editor from './editor.jsx';
import Manual from './manual.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {mode: 'code'};
  }
  nav(mode) {
    this.setState({mode: mode});
  }
  togglePlayback() {
    this.props.glitch.togglePlayback();
    this.forceUpdate();
  }
  render() {
    if (this.props.glitch) {
      return this.renderLayout();
    } else {
      return <p>Glitch failed to start</p>;
    }
  }
  renderLayout() {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var content;
    var playButton;

    if (this.state.mode == 'code') {
      content = <Editor glitch={this.props.glitch} style={{flex: '1'}}/>
    } else {
      content = <Manual />
    }

    if (this.props.glitch.player) {
      playButton = <IconButton
	icon="fa-stop"
	active="true"
	onClick={this.togglePlayback.bind(this)}
      />
	//color='#ff9800' />
    } else {
      playButton = <IconButton
	icon="fa-play"
	active="true"
	onClick={this.togglePlayback.bind(this)}
      />
	//color='#ff5722' />
    }

    return <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flex: '1', flexDirection: 'column'}}>
	<Header />
	<div style={{flex: '1', display: 'flex'}}>
	  {content}
	</div>
      </div>
      <div style={{width:'72px'}}>
	{playButton}
	<IconButton
	  icon="fa-code"
	  active={this.state.mode == "code"}
	  onClick={this.nav.bind(this, 'code')}/>
	<IconButton
	  icon="fa-question"
	  active={this.state.mode == "manual"}
	  onClick={this.nav.bind(this, 'manual')}/>
	{
	  // TODO: library with examples
	  // TODO: equalizer
	  // TODO: live instrument input
	}
      </div>
    </div>
  }
}

class Header extends React.Component {
  render() {
    return <div style={{display: 'flex', flexDirection: 'row'}}>
      <h1 style={{height: '72px', lineHeight:'72px', fontSize: '18pt'}}>
	#glitch
      </h1>
      <div style={{flex: '1'}}>
	{
	  // TODO: visualizer
	}
      </div>
    </div>
  }
}

class IconButton extends React.Component {
  render() {
    return <div {...this.props}
      style={{
	height: '72px', lineHeight: '72px', textAlign: 'center', cursor: 'pointer',
	fontSize: '20pt',
	opacity: (this.props.active ? '1' : '0.4'),
      }}>
      <i className={"fa " + this.props.icon} style={{color: this.props.color}}></i>
  </div>
  }
}
