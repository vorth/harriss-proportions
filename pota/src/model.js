
import { parse } from 'https://esm.sh/mathjs';

const expr = parse( '1/(1+x)+1/(1+x+1/x)' );

// Each array is an inverse of a sum, except the top one, which is just a sum.
//  So this means "1/(1+x)+1/(1+x+1/x)",
export const test = [
  1,
  [ 1, 'x' ],
  [ [ 'x' ], 'x', 1 ],
];


export const generateExprs = function*( squares, rects )
{
  if ( squares < 0 || rects < 0 )
    return;
  if ( squares === 0 && rects === 0 )
    return;
  if ( squares === 0 && rects === 1 ) {
    yield [ 'x' ];
    yield [ [ 'x' ] ];
    return;
  }
  if ( squares === 1 && rects === 0 ) {
    yield [ 1 ];
    return;
  }
  if ( squares === 1 && rects === 1 ) {
    yield [ 1, 'x' ];
    yield [ 1, [ 'x' ] ];
    yield [ [ 1, 'x' ] ];
    yield [ [ 1, [ 'x' ] ] ];
    return;
  }
  for ( const e of generateExprs( squares - 1, rects ) ) {
    yield [ 1, ...e ];
    yield [ 1, [ ...e ] ];
  }
  for ( const e of generateExprs( squares, rects - 1 ) ) {
    yield [ 'x', ...e ];
    yield [ 'x', [ ...e ] ];
  }
  for ( const e of generateExprs( squares, rects - 1 ) ) {
    yield [ [ 'x' ], ...e ];
    yield [ [ 'x' ], [ ...e ] ];
  }
}

export const generateGoodExprs = function*( squares, rects )
{
  for ( const e of generateExprs( squares, rects - 1 ) ) {
    yield [ [ 'x' ], ...e ];
    yield [ [ 'x' ], [ ...e ] ];
  }
  for ( const e of generateExprs( squares - 1, rects ) ) {
    yield [ 1, [ ...e ] ];
    yield [ 1, ...e ];
  }
}