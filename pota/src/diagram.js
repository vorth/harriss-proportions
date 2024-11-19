
import { html } from 'pota/html';

const UNIT = 300;

const Square = ( { size } ) =>
{
  const trueSize = () => size * UNIT;
  const style = () => `height: ${trueSize()}px; width: ${trueSize()}px;`;

  return html`<div class='one-block block' style="${style}"></div>`
}

const Rectangle = ( { tree, size, rotated } ) =>
{
  const trueSize = () => size * UNIT;
  const trueHeight = () => rotated? trueSize() : trueSize()*tree.width;
  const trueWidth =  () => rotated? trueSize()*tree.width : trueSize();
  const xColor =     () => rotated? '#eeb4a2' : '#824346';

  const style = () => `height: ${trueHeight()}px; width: ${trueWidth()}px; font-size: ${trueHeight()*0.6}px; background-color: ${xColor()};`;

  return html`<div class='x-block block' style="${style}"></div>`
}

const InverseDiagram = ( { size, tree, rotated } ) =>
{
  const child = html`<Diagram tree="${tree.inverse}" rotated="${!rotated}" size="${size}"/>`
  return html`
    <div class='inverse-block block'>
      ${child}
    </div>
  `
}

const SumDiagram = ( { size, tree, rotated } ) =>
{
  const style = () => rotated? `flex-direction:row;` : `flex-direction:column;`;

  const left  = html`<Diagram tree="${tree.left}"  rotated="${rotated}" size="${size}" />`
  const right = html`<Diagram tree="${tree.right}" rotated="${rotated}" size="${size}" />`
  return html`
    <div class='plus-block block' style="${style}">
      ${left}${right}
    </div>
  `
}

export const Diagram = ( { size, tree, rotated } ) =>
{
  return html`
    <Switch fallback="${html`
      <SumDiagram tree="${tree}" rotated="${rotated}" size="${size}" />`}"
    >
    <Match when="${tree.value === 1}">
      <Square size="${size}" />
    </Match>
    <Match when="${tree.value === 'x'}">
      <Rectangle tree="${tree}" rotated="${rotated}" size="${size}" />
    </Match>
    <Match when="${tree.inverse}">
      <InverseDiagram tree="${tree}" rotated="${rotated}" size="${size*tree.width}" />
    </Match>
  </Switch>`
}
  
html.define({ Square, Rectangle, InverseDiagram, SumDiagram, Diagram });
