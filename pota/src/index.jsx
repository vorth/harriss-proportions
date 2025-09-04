
import { createSignal, onMount } from 'solid-js'
import { render } from 'solid-js/web'

import { render as potaRender } from 'pota';

import { Equation } from './equation.js';
import { Diagram } from './diagram.jsx';
import { SelectionProvider, useSelection } from './context.jsx';

import { rect, invrect, sum, d, e, f } from './model.js';


const ProportionsUI = ( props ) =>
{
  const setSynSize = w => {} //console.log( 'total width', w );

  const { state } = useSelection();
  const [ x, setX ] = createSignal( 1.5 );
  const [ rotate, setRotate ] = createSignal( false );

  const onInput = ( { target } ) =>
  {
    setX( target.value );
  }
  
  onMount( () => {
    // potaRender( () => Equation( { tree: state } ), document.getElementById( 'equation-root' ) );
  });

  return (
    <div class='proportion-display'>
      <input type="range" id="x" name="volume" min="1" max="4" step="0.01" value={x()} onInput={onInput} />

      {/* <input type="checkbox" name="rotate" id="rotate" onInput={(e) => setRotate(e.target.checked)} /> */}

      <div id="equation-root"></div>

      <div class='diagram' >
        <Diagram tree={state} path={[]} x={x()} rotated={rotate()} inhSize={props.scale} setSynSize={setSynSize} />
      </div>
    </div>
  );
}

const Proportions = ( props ) =>
{
  return (
    <SelectionProvider tree={props.tree}>
      <ProportionsUI scale={props.scale} />
    </SelectionProvider>
  );
}

const App = () =>
{
  return ( <Proportions tree={ e } scale={ 20 } /> )
}

const root = document.getElementById( 'root' )

render(() => <App />, root)
