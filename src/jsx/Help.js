import React from 'react'
import ReactDOM from 'react-dom'

import {YELLOW, GRAY, WHITE} from '../colors'

const helpStyle = {
  color: YELLOW,
}

export default class Help extends React.Component {
  render() {
    return <div style={helpStyle}>
      <p>Glitch is an algorithmic synthesizer - it makes music from math.</p>
      <br />

      <h4>### Input and output ###</h4>
      <br/>
      <p>
	There is a variable `t` which gets incremented as time goes.  The
	sample rate is 8000Hz and audio sample value will be in the range
	[0..255] (overflow will happen if a value is outside of the range). For
	example the expression `t` gives a sawtooth wave at 31Hz.
      </p>
      <br />

      <h4>### Operators ###</h4>
      <br/>
      <p>- Basic arithmetics: + - * / % ** ( )</p>
      <p>- Bitwise arithmetics: &lt;&lt; &gt;&gt; | &amp; ^</p>
      <p>- Logical operations: &lt; &gt; &lt;= &gt;= == != &amp;&amp; ||</p>
      <p>- Any letter or word becomes a variable. `t` is special, it's increased on each iteration while other variables are preserved. `=` can be used to assign values to variables. `,` can be used to combine multiple expressions - the result is the result of the last expression, e.g. `a=6,b=a+1,a*b` returns 42.</p>
    </div>
  }
}
