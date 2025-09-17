
import { createContext, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';


const SelectionContext = createContext( { toggleSelection: () => {} } );

const pathsEqual = ( path1, path2 ) =>
{
  if ( !path1 !== !path2 ) return false;
  if ( path1.length !== path2.length ) return false;
  for ( let i = 0; i < path1.length; i++ ) {
    if ( path1[i] !== path2[i] ) return false;
  }
  return true;
}

const SelectionProvider = ( props ) =>
{
  const [ state, setState ] = createStore( props.tree );
  const [ selection, setSelection ] = createSignal( null );

  const toggleSelection = ( evt, path ) =>
  {    
    const oldPath = selection();
    if ( !!oldPath && oldPath .length > 0 ) {
      setState( ...oldPath, 'selected', false );
    }
    if ( pathsEqual( oldPath, path ) ) {
      setSelection( null );
    } else {
      setState( ...path, 'selected', true );
      setSelection( path );  
    }
    evt .stopPropagation();
  }
  
  return (
    <SelectionContext.Provider value={ { state, setState, toggleSelection } }>
      {props.children}
    </SelectionContext.Provider>
  );
}

const useSelection = () => { return useContext( SelectionContext ); };

export { SelectionProvider, useSelection };