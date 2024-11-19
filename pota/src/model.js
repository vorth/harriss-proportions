
import { parse } from 'https://esm.sh/mathjs';

const expr = parse( '1/(1+x)+1/(1+x+1/x)' );


export const tree = {
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
