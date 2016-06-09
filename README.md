# Glitch

[![Build Status](https://travis-ci.org/naivesound/glitch.svg?branch=master)](https://travis-ci.org/naivesound/glitch)
[![Dependency Status](https://david-dm.org/naivesound/glitch.svg)](https://david-dm.org/naivesound/glitch)
[![devDependency Status](https://david-dm.org/naivesound/glitch/dev-status.svg)](https://david-dm.org/naivesound/glitch#info=devDependencies)

Glitch is a minimal synthesizer and composer for algorithmic music.

## Reference

Operators:

- + - * / % \*\* ( )
- &lt;&lt; &gt;&gt; | &amp; ^
- &lt; &gt; &lt;= &gt;= == != &amp;&amp; ||
- `=`
- `,`

Sequencers:

- loop(bpm, ...)
- seq(bpm, ...)
- slide(bpm,...)
- a(index, ...)
- scale(index, mode)

Instruments:

- sin(hz)
- tri(hz)
- saw(hz)
- sqr(hz, [width])
- fm(hz, [m1, a1, m2, a2, m3, a3])

Effects:

- env(releaseTime, x)
- env(attackTime, [interval, gain]..., x)
- lpf(x, frequency)
- mix(...)

Utils:

- hz(note)
- r(max)
- l(x)
- s(phase)
