
import { createEffect, createSignal } from 'solid-js';

import { useSelection } from './context.jsx';

const Square = ( props ) =>
{
  const style = () => ({ height: `${props.inhSize}rem`, width: `${props.inhSize}rem` });

  createEffect( () => props.setSynSize && props.setSynSize( props.inhSize ) );
  const { toggleSelection } = useSelection();

  return ( <div class={`one-block block ${props.tree.selected?'selected':''}`} style={ style() } onClick={(e)=>toggleSelection(e,props.path)} ></div> );
}

const Rectangle = ( props ) =>
{
  const variableSize = () => props.x * props.inhSize;
  const xHeight = () => props.rotated? variableSize() : props.inhSize;
  const xWidth = () => props.rotated? props.inhSize : variableSize();
  const xColor = () => props.rotated? '#eeb4a2' : '#824346';
  const style = () => ({ height: `${xHeight()}rem`, width: `${xWidth()}rem`, 'background-color': xColor() });

  createEffect( () => props.setSynSize && props.setSynSize( variableSize() ) );
  const { toggleSelection } = useSelection();

  return ( <div class={`x-block block ${props.tree.selected?'selected':''}`} style={ style() } onClick={(e)=>toggleSelection(e,props.path)} ></div> );
}

const SumDiagram = ( props ) =>
{
  let [ leftWidth, setLeftWidth ] = createSignal( 0 );
  let [ rightWidth, setRightWidth ] = createSignal( 0 );
  const variableSize = () => leftWidth() + rightWidth();
  const xHeight = () => props.rotated? variableSize() : props.inhSize;
  const xWidth = () => props.rotated? props.inhSize : variableSize();
  const writingMode = () => props.rotated? 'vertical-lr' : 'horizontal-tb';
  createEffect( () => {
    props.setSynSize && props.setSynSize( variableSize() );
  } );
  const style = () => ({ height: `${xHeight()}rem`, width: `${xWidth()}rem`, 'writing-mode': writingMode() });

  return (
    <div class={`plus-block block ${props.tree.selected?'selected':''}`} style={ style() } >
      <Diagram tree={props.tree.left} path={[ ...props.path, 'left' ]}  x={props.x} rotated={props.rotated} inhSize={props.inhSize} setSynSize={setLeftWidth} />
      <Diagram tree={props.tree.right} path={[ ...props.path, 'right' ]}  x={props.x} rotated={props.rotated} inhSize={props.inhSize} setSynSize={setRightWidth} />
    </div>
  );
}

const InverseDiagram = ( props ) =>
{
  let [ variableSize, setVariableSize ] = createSignal( 0 );
  const xWidth = () => scale() * (props.rotated? variableSize() : props.inhSize);
  const xHeight = () => scale() * (props.rotated? props.inhSize : variableSize());
  const scale = () => props.inhSize / variableSize();
  createEffect( () => props.setSynSize && props.setSynSize( scale() * props.inhSize ) );

  const style = () => ({
    'height'    : `${xHeight()}rem`,
    'width'     : `${xWidth()}rem`,
    'transform' : `scale(${scale()})`,
    'transform-origin': 'top left',
  });

  return (
    <div class={`inverse-block ${props.tree.selected?'selected':''}`} style={ style() } >
      <Diagram tree={props.tree.inverse} path={[ ...props.path, 'inverse' ]} rotated={!props.rotated} inhSize={props.inhSize} x={props.x} setSynSize={setVariableSize} />
    </div>
  );
}

export const Diagram = ( props ) =>
{
  return (
    <Switch fallback={
      <SumDiagram tree={props.tree} path={props.path} rotated={props.rotated} inhSize={props.inhSize} x={props.x} setSynSize={props.setSynSize} />}
    >
    <Match when={props.tree.value === 1} >
      <Square tree={props.tree} path={props.path} inhSize={props.inhSize} setSynSize={props.setSynSize} />
    </Match>
    <Match when={props.tree.value === 'x'} >
      <Rectangle tree={props.tree} path={props.path} rotated={props.rotated} inhSize={props.inhSize} x={props.x} setSynSize={props.setSynSize} />
    </Match>
    <Match when={props.tree.inverse} >
      <InverseDiagram tree={props.tree} path={props.path} rotated={props.rotated} inhSize={props.inhSize} x={props.x} setSynSize={props.setSynSize} />
    </Match>
  </Switch>
  );
}
  
