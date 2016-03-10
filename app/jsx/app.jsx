import React from 'react';
import ReactDOM from 'react-dom';

import Visualizer from './visualizer.jsx';
import Editor from './editor.jsx';
import Library from './library.jsx';
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
  componentDidMount() {
    window.onhashchange = () => {
      if (this.props.glitch) {
	this.props.glitch.compile(decodeURIComponent(window.location.hash.substring(1)));
      }
      this.forceUpdate();
    };
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
    } else if (this.state.mode == 'lib') {
      content = <Library glitch={this.props.glitch} />
    } else {
      content = <Manual />
    }

    if (this.props.glitch.player) {
      playButton = <IconButton
	icon="fa-stop"
	active="true"
	onClick={this.togglePlayback.bind(this)}
      />
    } else {
      playButton = <IconButton
	icon="fa-play"
	active="true"
	onClick={this.togglePlayback.bind(this)}
      />
    }

    return <div className="content" style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flex: '1', flexDirection: 'column'}}>
	<Header glitch={this.props.glitch} />
	<div style={{flex: '1', display: 'flex'}}>
	  {content}
	</div>
      </div>
      <div style={{width:'72px', display: 'flex', flexDirection: 'column'}}>
	{playButton}
	<IconButton
	  icon="fa-code"
	  active={this.state.mode == "code"}
	  onClick={this.nav.bind(this, 'code')}/>
	<IconButton
	  icon="fa-folder-open"
	  active={this.state.mode == "lib"}
	  onClick={this.nav.bind(this, 'lib')}/>
	{
	  // TODO: save wave file
	  // TODO: live instrument input
	}
	<IconButton
	  icon="fa-question"
	  active={this.state.mode == "manual"}
	  onClick={this.nav.bind(this, 'manual')}/>
	<div style={{flex: '1'}}></div>
	<a 
	  style={{
	    height: '72px', lineHeight: '72px', textAlign: 'center', cursor: 'pointer',
	    fontSize: '20pt',
	    color: '#03a9f4',
	  }}
	  href={
	    "https://twitter.com/intent/tweet?" +
	    "text=I made a bytebeat tune!&" +
	      "hashtags=glitch&url="+encodeURIComponent(window.location.href)}>
	      <i className="fa fa-bird"></i></a>
      </div>
    </div>
  }
}

class Header extends React.Component {
  render() {
    return <div style={{display: 'flex', flexDirection: 'row'}}>
      <h1 className="monospace" style={{height: '72px', lineHeight:'72px', fontSize: '18pt'}}>
	#glitch
      </h1>
      <Visualizer glitch={this.props.glitch} />
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
