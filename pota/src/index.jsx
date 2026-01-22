
import { createSignal, For, onMount } from 'solid-js'
import { render } from 'solid-js/web'

import { Equation } from './equation.jsx';
import { Diagram } from './diagram.jsx';
import { SelectionProvider, useSelection } from './context.jsx';
import { solveEquation } from './solver.js';

import { generateGoodExprs, printExpr } from './model.js';

const queryParams = new URLSearchParams( window.location.search );
const targetExpr = queryParams.get( 'expr' );

let exprs = [];

async function loadExpressionsWithPositiveRoots() {
  if ( targetExpr ) {
    console.log( targetExpr );
    exprs.push( JSON.parse( targetExpr ) );
  } else {
    console.log('Generating and filtering expressions...');
    const allExprs = [];
    
    // Generate all expressions
    for ( const e of generateGoodExprs( 1, 3 ) ) {
      allExprs.push(e);
    }
    
    console.log(`Generated ${allExprs.length} expressions, checking for positive roots...`);
    
    // Filter expressions that have positive real roots
    for (const expr of allExprs) {
      const equationStr = printExpr(expr);
      console.log(`Checking: ${equationStr}`);
      
      const solution = await solveEquation(equationStr);
      if (solution.has_positive_roots) {
        const rootValue = solution.float_values[0];
        console.log(`✓ Has positive roots: ${equationStr} = ${rootValue}`);
        exprs.push({ expr, rootValue });
      }
    }
    
    console.log(`Found ${exprs.length} expressions with positive real roots`);
  }
  return exprs;
}

const ProportionSystem = ( props ) =>
{
  const setSynSize = w => {} //console.log( 'total width', w );

  return (
    <div class='proportion-system'>
      <Equation tree={props.tree} />
      {props.x && (
        <div class='root-value' style={{ 'margin-top': '8px', 'font-weight': 'bold', color: '#333' }}>
          x ≈ {props.x.toFixed(6)}
        </div>
      )}

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
  const [ expressions, setExpressions ] = createSignal( [] );
  const [ loading, setLoading ] = createSignal( true );

  onMount(async () => {
    const filteredExprs = await loadExpressionsWithPositiveRoots();
    setExpressions(filteredExprs);
    setLoading(false);
  });

  const onInput = ( { target } ) =>
  {
    setX( target.value );
  }
  
  return (
    <div class='proportion-display'>
      {loading() && <p>Hang on, just doing a few seconds of algebra...</p>}
      
      {/* <input type="range" id="x" name="volume" min="1" max="4" step="0.01" value={x()} onInput={onInput} /> */}

      {/* <input type="checkbox" name="rotate" id="rotate" onInput={(e) => setRotate(e.target.checked)} /> */}

      <div class='enumeration'>
        <For each={expressions()}>
          {(item) => (
            <ProportionSystem tree={item.expr} scale={5} rotate={rotate()} x={item.rootValue} />
          )}
        </For>
      </div>

    </div>
  );
}

const root = document.getElementById( 'root' )

render(() => <App />, root)
