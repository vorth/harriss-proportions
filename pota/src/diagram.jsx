
import { createEffect, createSignal } from 'solid-js';

import { useSelection } from './context.jsx';

const Square = ( props ) =>
{
  const style = () => ({ height: `${props.size}rem`, width: `${props.size}rem` });

  createEffect( () => props.setWidth && props.setWidth( props.size ) );
  const { toggleSelection } = useSelection();

  return ( <div class={`one-block block ${props.tree.selected?'selected':''}`} style={ style() } onClick={(e)=>toggleSelection(e,props.path)} ></div> );
}

const Rectangle = ( props ) =>
{
  const xColor = () => props.rotated? '#eeb4a2' : '#824346';
  const width = () => props.x * props.size;
  const style = () => ({ height: `${props.size}rem`, width: `${width()}rem`, 'background-color': xColor() });

  createEffect( () => props.setWidth && props.setWidth( width() ) );
  const { toggleSelection } = useSelection();

  return ( <div class={`x-block block ${props.tree.selected?'selected':''}`} style={ style() } onClick={(e)=>toggleSelection(e,props.path)} ></div> );
}

const InverseDiagram = ( props ) =>
{
  let [ invWidth, setInvWidth ] = createSignal( 0 );
  const scale = () => props.size / invWidth();
  const width = () => props.size * scale();
  const offset = () => (invWidth() - width()) / 2;
  // createEffect( () => console.log( 'inv width', width() ) );
  createEffect( () => props.setWidth && props.setWidth( width() ) );

  const style = () => ({
    'transform'       : `rotate(-90deg) translate(-${props.size}rem) scale(${scale()})`,
    'transform-origin': 'top left',
  });

  const { toggleSelection } = useSelection();

  return (
    <div class={`inverse-block block ${props.tree.selected?'selected':''}`} style={ style() } >
      <Diagram tree={props.tree.inverse} path={[ ...props.path, 'inverse' ]} rotated={!props.rotated} size={props.size} x={props.x} setWidth={setInvWidth} />
    </div>
  );
}

const SumDiagram = ( props ) =>
{
  let [ leftWidth, setLeftWidth ] = createSignal( 0 );
  let [ rightWidth, setRightWidth ] = createSignal( 0 );
  createEffect( () => {
    // console.log( 'left:', leftWidth(), 'right:', rightWidth() );
    props.setWidth && props.setWidth( leftWidth() + rightWidth() );
  } );
  const style = () => ({ width: `${ leftWidth() + rightWidth() }rem` });

  const { toggleSelection } = useSelection();

  return (
    <div class={`plus-block block ${props.tree.selected?'selected':''}`} style={ style() } >
      <Diagram tree={props.tree.left} path={[ ...props.path, 'left' ]}  x={props.x} rotated={props.rotated} size={props.size} setWidth={setLeftWidth} />
      <Diagram tree={props.tree.right} path={[ ...props.path, 'right' ]}  x={props.x} rotated={props.rotated} size={props.size} setWidth={setRightWidth} />
    </div>
  );
}

export const Diagram = ( props ) =>
{
  return (
    <Switch fallback={
      <SumDiagram tree={props.tree} path={props.path} rotated={props.rotated} size={props.size} x={props.x} setWidth={props.setWidth} />}
    >
    <Match when={props.tree.value === 1} >
      <Square tree={props.tree} path={props.path} size={props.size} setWidth={props.setWidth} />
    </Match>
    <Match when={props.tree.value === 'x'} >
      <Rectangle tree={props.tree} path={props.path} rotated={props.rotated} size={props.size} x={props.x} setWidth={props.setWidth} />
    </Match>
    <Match when={props.tree.inverse} >
      <InverseDiagram tree={props.tree} path={props.path} rotated={props.rotated} size={props.size} x={props.x} setWidth={props.setWidth} />
    </Match>
  </Switch>
  );
}
  
