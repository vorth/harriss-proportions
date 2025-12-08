
import { createSignal, For, onMount } from 'solid-js'
import { render } from 'solid-js/web'

import { Equation } from './equation.jsx';
import { Diagram } from './diagram.jsx';
import { SelectionProvider, useSelection } from './context.jsx';

import { test, generateGoodExprs } from './model.js';

const queryParams = new URLSearchParams( window.location.search );
const targetExpr = queryParams.get( 'expr' );

const exprs = [];
if ( targetExpr ) {
  console.log( targetExpr );
  exprs.push( JSON.parse( targetExpr ) );
} else {
  for ( const e of generateGoodExprs( 1, 3 ) ) {
    console.log( JSON.stringify( e ) );
    exprs.push( e );
  }
}

const ProportionSystem = ( props ) =>
{
  const setSynSize = w => {} //console.log( 'total width', w );

  return (
    <div class='proportion-system'>
      <Equation tree={props.tree} />

      <div class='diagram' >
        <Diagram tree={props.tree} path={[]} x={props.x} rotated={props.rotate} inverse={false}
          inhSize={props.scale} setSynSize={setSynSize} />
      </div>
    </div>
  );
}

// const Proportions = ( props ) =>
// {
//   return (
//     <SelectionProvider tree={props.tree}>
//       <ProportionsUI scale={props.scale} />
//     </SelectionProvider>
//   );
// }

const App = () =>
{
  const [ x, setX ] = createSignal( 1.5 );
  const [ rotate, setRotate ] = createSignal( false );

  const onInput = ( { target } ) =>
  {
    setX( target.value );
  }
  
  return (
    <div class='proportion-display'>
      <input type="range" id="x" name="volume" min="1" max="4" step="0.01" value={x()} onInput={onInput} />

      {/* <input type="checkbox" name="rotate" id="rotate" onInput={(e) => setRotate(e.target.checked)} /> */}

      <div class='enumeration'>
        <For each={exprs}>
          {(expr) => (
            <ProportionSystem tree={expr} scale={5} rotate={rotate()} x={x()} />
          )}
        </For>
      </div>

    </div>
  );
}

const root = document.getElementById( 'root' )

render(() => <App />, root)
