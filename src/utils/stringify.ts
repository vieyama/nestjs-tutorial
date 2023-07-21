// Works the same as JSON.stringify,
// but also handles BigInt type:

import { toNumber } from 'lodash';

function stringify(value: bigint) {
  if (value !== undefined) {
    const stringValue = value.toString();
    return toNumber(stringValue);
  }
}
export { stringify };
