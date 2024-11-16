import { render } from 'pota';
// import { simplify, parse } from 'mathjs';

import { html } from 'pota/html'

// const expr = parse( '1/(1+x)+1/(1+x+1/x)' );

const tree = {
  left: {
    left: { value: 1 },
    right: {
      inverse: {
        left: { value: 1 },
        right: { value: 'x' }
      }
    }
  },
  right: {
    inverse: {
      left: { value: 1 },
      right: {
        left: { value: 'x' },
        right: {
          inverse: { value: 'x' }
        }
      }
    }
  }
}

const resolve = ( tree, x ) =>
{
  if ( tree.value === 1 ) {
    tree.width = 1;
  } else if ( tree.value === 'x' ) {
    tree.width = x;
  } else if ( tree.inverse ) {
    resolve( tree.inverse, x );
    tree.width = 1 / tree.inverse.width;
    tree.rotate = true;
  } else {
    resolve( tree.left, x );
    resolve( tree.right, x );
    tree.width = tree.left.width + tree.right.width;
  }
}

resolve( tree, 1.4 );

console.dir( tree );

const UNIT = 300;

const Diagram = ( { size, tree, rotated } ) =>
{
  const trueSize = () => size * UNIT;
  const fontSize = () => trueSize() * 0.6;
  const trueHeight = () => rotated? trueSize() : trueSize()*tree.width;
  const trueWidth =  () => rotated? trueSize()*tree.width : trueSize();
  const xColor =     () => rotated? '#eeb4a2' : '#824346';

  const style1 = () => `height: ${trueSize()}px; width: ${trueSize()}px; font-size: ${fontSize()}px;`;
  const styleX = () => `height: ${trueHeight()}px; width: ${trueWidth()}px; font-size: ${trueHeight()*0.6}px; background-color: ${xColor()};`;

  const stylePlus = () => rotated? `flex-direction:row;` : `flex-direction:column;`;

  return html`
    <Switch fallback="${html`
      <div class='plus-block block' style="${stylePlus}">
        <Diagram tree="${tree.left}" rotated="${rotated}" size="${size}" />
        <Diagram tree="${tree.right}" rotated="${rotated}" size="${size}" />
      </div>`}"
    >
    <Match when="${tree.value === 1}">
      <div class='one-block block' style="${style1}"></div>
    </Match>
    <Match when="${tree.value === 'x'}">
      <div class='x-block block' style="${styleX}"></div>
    </Match>
    <Match when="${tree.inverse}">
      <div class='inverse-block block'>
        <Diagram tree="${tree.inverse}" rotated="${!rotated}" size="${size*tree.width}"/>
      </div>
    </Match>
  </Switch>`
}
  
const CanonicalExpression = ({ tree }) =>
{
  return html`
    <Switch fallback="${html`
        <mrow>
          <CanonicalExpression tree="${tree.left}" />
          <mo>+</mo>
          <CanonicalExpression tree="${tree.right}" />
        </mrow>`}"
    >
      <Match when="${tree.value === 1}">
        <mn>1</mn>
      </Match>
      <Match when="${tree.value === 'x'}">
        <mi>x</mi>
      </Match>
      <Match when="${tree.inverse}">
        <mfrac>
          <mn>1</mn>
          <CanonicalExpression tree="${tree.inverse}" />
        </mfrac>
      </Match>
    </Switch>`
}

const Equation = ({ tree }) =>
{
  html.define({ CanonicalExpression })

  return html`
    <math class="equation" display="block">
      <mrow>
        <mi>x</mi>
        <mo>=</mo>
        <CanonicalExpression tree="${tree}" />
      </mrow>
    </math>`
}

const Proportions = ({ tree }) =>
{
  html.define({ Equation, Diagram })

  return html `
    <div class='proportion-display'>
      <Equation tree="${tree}"/>
      <div class='diagram'>
        <Diagram tree="${tree}" size="1" rotated="false"/>
      </div>
    </div>
  `
}

function App()
{
  html.define({ Proportions });
  return html`<Proportions tree="${tree}" />`
}

render(App)
