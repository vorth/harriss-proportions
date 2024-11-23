
import { createSignal, onMount } from 'solid-js'
import { render } from 'solid-js/web'

import { render as potaRender } from 'pota';

import { Equation } from './equation.js';
import { Diagram } from './diagram.jsx';

import { a, b, c, d, e } from './model.js';

const [ x, setX ] = createSignal( 1.5 );

const onInput = ( { target } ) =>
{
  setX( target.value );
}

const Proportions = ( props ) =>
{
  const setWidth = w => {} //console.log( 'total width', w );

  onMount( () => {
    potaRender( () => Equation( { tree: props.tree } ), document.getElementById( 'equation-root' ) );
  });

  return (
    <div class='proportion-display'>
      <input type="range" id="x" name="volume" min="1" max="4" step="0.01" value={x()} onInput={onInput} />

      <div id="equation-root"></div>

      <div class='diagram' >
        <Diagram tree={props.tree} x={x()} rotated={true} size={props.scale} setWidth={setWidth} />
      </div>
    </div>
  );
}

const App = () =>
{
  return ( <Proportions tree={ e } scale={ 12 } /> )
}

const root = document.getElementById( 'root' )

render(() => <App />, root)
