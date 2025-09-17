
import { parse } from 'https://esm.sh/mathjs';

const expr = parse( '1/(1+x)+1/(1+x+1/x)' );

export const rect = { value: 'x' };

export const invrect = {
  inverse: rect
}

export const sum = {
  left: invrect,
  right: { value: 'x' }
}

export const d = {
  left: { value: 1 },
  right: {
    left: { value: 'x' },
    right: { inverse: { value: 'x'}}
  }
}

export const e = {
  left: {
    left: { value: 1 },
    right: {
      inverse: sum
    }
  },
  right: {
    inverse: d
  }
}

export const f = {
  left: {
    inverse: { value: 'x' }
  },
  right: {
    inverse: {
      left: { value: 1 },
      right: { inverse: { value: 'x' } }
    }
  }
}


function factory(i) {
    if (i === 1) return { value: 1 };
    if (i === 2) return { value: 'x' };
    return { inverse: { value: 'x' } };
}

const Sum = ( l, r ) => ( { left: l, right: r } );
const InverseSum = ( l, r ) => ( { inverse: Sum( l, r ) } );

export const generateExprs = () =>
{
  const exprs = new Map();

  const addUnique = element => {
    const str = JSON.stringify(element);
    if (!exprs.has(str)) {
        console.log("NEW " + str);
        exprs.set(str, element);
    }
  }

  const enumerate = expr =>
  {
    for (let a = 1; a < 3; a++) {
      for (let b = 1; b < 3; b++) {
        for (let c = 1; c < 3; c++) {
          for (let d = 1; d < 3; d++) {
            const ae = factory(a);
            const be = factory(b);
            const ce = factory(c);
            const de = factory(d);
            addUnique( expr(ae, be, ce, de) );
          }
        }
      }
    }
  }
  enumerate( (ae,be,ce,de) => InverseSum(Sum(ae, be), Sum(ce, de)) );
  enumerate( (ae,be,ce,de) => InverseSum(Sum(ae, be), InverseSum(ce, de)) );
  enumerate( (ae,be,ce,de) => InverseSum(InverseSum(ae, be), Sum(ce, de)) );
  enumerate( (ae,be,ce,de) => InverseSum(InverseSum(ae, be), InverseSum(ce, de)) );
  return Array.from(exprs.values());
}

