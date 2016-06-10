import React from 'react';

import { connect } from 'react-redux';

import { playbackMode, tab } from '../reducers';
import { navigate, play, stop, exportWav } from '../actions';

import { YELLOW } from '../colors';

const toolbarStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '72px',
};

const iconButtonStyle = {
  color: YELLOW,
  height: '72px',
  lineHeight: '72px',
  textAlign: 'center',
  cursor: 'pointer',
  fontSize: '20pt',
};

function Toolbar(props) {
  return (<div style={toolbarStyle}>
    <PlayButton mode={props.mode} dispatch={props.dispatch} />
    <IconButton
      icon="fa-code"
      active={props.tab === tab.EDITOR}
      onClick={() => props.dispatch(navigate(tab.EDITOR))}
    />
    <IconButton
      icon="fa-folder-open"
      active={props.tab === tab.LIBRARY}
      onClick={() => props.dispatch(navigate(tab.LIBRARY))}
    />
    <IconButton
      icon="fa-question"
      active={props.tab === tab.HELP}
      onClick={() => props.dispatch(navigate(tab.HELP))}
    />
    <div style={{ flex: 1 }}></div>
    <IconButton
      icon="fa-floppy-o"
      active
      onClick={() => props.dispatch(exportWav())}
    />
  </div>);
}
Toolbar.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  tab: React.PropTypes.string.isRequired,
  mode: React.PropTypes.string.isRequired,
};

function PlayButton(props) {
  if (props.mode === playbackMode.STOPPED) {
    return (<IconButton
      icon="fa-play"
      active
      onClick={() => props.dispatch(play())}
    />);
  } else if (props.mode === playbackMode.PLAYING) {
    return (<IconButton
      icon="fa-stop"
      active
      onClick={() => props.dispatch(stop())}
    />);
  }
}
PlayButton.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  mode: React.PropTypes.string.isRequired,
};

function IconButton(props) {
  const opacity = props.active ? 1 : 0.4;
  const style = Object.assign({}, iconButtonStyle, { opacity });
  return (<div {...props} style={style}>
    <i className={`fa ${props.icon}`} style={{ color: props.color }}></i>
  </div>);
}
IconButton.propTypes = {
  active: React.PropTypes.bool.isRequired,
  icon: React.PropTypes.string.isRequired,
  color: React.PropTypes.string,
};

function mapStateToProps(state) {
  return { tab: state.navigation.tab, mode: state.playback.mode };
}

export default connect(mapStateToProps)(Toolbar);

