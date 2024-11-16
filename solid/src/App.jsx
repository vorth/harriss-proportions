
import { Switch, Match } from 'solid-js';

const tree = {
  left: {
    inverse: {
      left: 1,
      right: 'x'
    }
  },
  right: {
    inverse: {
      left: 1,
      right: {
        left: 'x',
        right: {
          inverse: 'x'
        }
      }
    }
  }
}

const renderMathML = tree =>
{
  if ( tree === 1 ) {
    const result = document .createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mn' );
    result .textContent = '1';
    return result;
  }
  if ( tree === 'x' ) {
    const result = document .createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mi' );
    result .textContent = 'x';
    return result;
  }
  if ( tree.inverse ) {
    const result = document .createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mfrac' );
    const num = document .createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mn' );
    num .textContent = '1';
    result .appendChild( num );
    const denom = renderMathML( tree.inverse );
    result .appendChild( denom );
    return result;
  } else {
    const result = document .createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mrow' );
    const left = renderMathML( tree.left );
    result .appendChild( left );
    const op = document .createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mn' );
    op .textContent = '+';
    result .appendChild( op );
    const denom = renderMathML( tree.right );
    result .appendChild( denom );
    return result;
  }
}

const CanonicalExpression = props =>
{
  return (
    <Switch fallback={
        <mrow>
          <CanonicalExpression tree={props.tree.left} />
          <mo>+</mo>
          <CanonicalExpression tree={props.tree.right} />
        </mrow>
      }>
      <Match when={ props.tree === 1 } >
        <mn>1</mn>
      </Match>
      <Match when={props.tree === 'x'}>
        <mi>x</mi>
      </Match>
      <Match when={props.tree.inverse}>
        <mfrac>
          <mn>1</mn>
          <CanonicalExpression tree={props.tree.inverse} />
        </mfrac>
      </Match>
    </Switch>
  );
}

function App() {
  return (
    <p>
      Where is my
      <math display='block' >
        <mrow>
          <mi>x</mi>
          <mo>=</mo>
          { renderMathML( tree ) }
        </mrow>
      </math>
      math?
    </p>
  );
}

export default App;
