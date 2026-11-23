import { greet } from './util.js';

import os from 'node:os';

console.log(greet(os.platform()));
