import { render, signal } from 'pota';
import { html } from 'pota/html';

import './equation.js';
import './diagram.js';

import { tree } from './model.js';

const Proportions = ({ tree }) =>
{
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
