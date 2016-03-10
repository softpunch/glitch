import React from 'react';

export default class Debugger extends React.Component {
  componentDidMount() {
    this.tid = setInterval(this.forceUpdate.bind(this), 100)
  }
  componentWillUnmount() {
    clearInterval(this.tid);
  }
  render() {
    var list = [];
    var vars = this.props.glitch.vars;
    // TODO sort by name
    for (var k in vars) {
      if (vars.hasOwnProperty(k)) {
	list.push(
	  <div>
	    <span>{k}</span>
	    <span>{vars[k]().toFixed(2)}</span>
	  </div>
	);
      }
    }
    return <div>{list}</div>;
  }
}
 
