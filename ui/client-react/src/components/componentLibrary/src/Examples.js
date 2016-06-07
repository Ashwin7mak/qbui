/* eslint no-path-concat: 0, no-var: 0, key-spacing: 0 */
import fs from 'fs';

export default {
  QBIconBasic:  require('fs').readFileSync(__dirname + './examples/QBIconExample.js', 'utf8'),
};
