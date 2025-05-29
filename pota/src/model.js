
import { parse } from 'https://esm.sh/mathjs';

const expr = parse( '1/(1+x)+1/(1+x+1/x)' );

export const a = { value: 'x' };

export const b = {
  inverse: a
}

export const c = {
  left: { value: 1 },
  right: { value: 'x' }
}

export const d = {
  left: { value: 1 },
  right: {
    left: { value: 'x' },
    right: b
  }
}

export const e = {
  left: {
    left: { value: 1 },
    right: {
      inverse: c
    }
  },
  right: {
    inverse: d
  }
}

