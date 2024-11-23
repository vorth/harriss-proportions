
import { html } from 'pota/html';

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

export const Equation = ({ tree }) =>
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

