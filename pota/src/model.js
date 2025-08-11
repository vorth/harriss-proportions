
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
    right: invrect
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

