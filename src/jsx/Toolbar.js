import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'

import { playbackMode, tab } from '../reducers'
import { navigate, play, stop, exportWav } from '../actions'

import {YELLOW, GRAY, WHITE} from '../colors'

const toolbarStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '72px',
}

const iconButtonStyle = {
  color: YELLOW,
  height: '72px',
  lineHeight: '72px',
  textAlign: 'center',
  cursor: 'pointer',
  fontSize: '20pt',
}

class Toolbar extends React.Component {
  render() {
    console.log(this.props);
    return <div style={toolbarStyle}>
      <PlayButton mode={this.props.playback.mode} dispatch={this.props.dispatch} />
      <IconButton icon="fa-code"
	active={this.props.navigation.tab == tab.EDITOR}
	onClick={this.props.dispatch.bind(this, navigate(tab.EDITOR))} />
      <IconButton icon="fa-folder-open"
	active={this.props.navigation.tab == tab.LIBRARY}
	onClick={this.props.dispatch.bind(this, navigate(tab.LIBRARY))} />
      <IconButton icon="fa-question"
	active={this.props.navigation.tab == tab.HELP}
	onClick={this.props.dispatch.bind(this, navigate(tab.HELP))} />
      <div style={{flex: 1}}></div>
      <IconButton icon="fa-floppy-o"
	active={true}
	onClick={this.props.dispatch.bind(this, exportWav())} />
    </div>
  }
}

class PlayButton extends React.Component {
  render() {
    console.log(this.props);
    if (this.props.mode == playbackMode.STOPPED) {
      return <IconButton icon="fa-play" active="true"
	onClick={this.props.dispatch.bind(this, play())} />
    } else if (this.props.mode == playbackMode.PLAYING) {
      return <IconButton icon="fa-stop" active="true"
	onClick={this.props.dispatch.bind(this, stop())} />
    }
  }
}

class IconButton extends React.Component {
  render() {
    return <div {...this.props}
      style={Object.assign({}, iconButtonStyle, {
	opacity: (this.props.active ? '1' : '0.4'),
      })}>
      <i className={"fa " + this.props.icon} style={{color: this.props.color}}></i>
    </div>
  }
}

function mapStateToProps(state) {
  return {navigation: state.navigation, playback: state.playback}
}

export default connect(mapStateToProps)(Toolbar)

