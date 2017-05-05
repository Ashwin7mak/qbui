const assert = require('assert');

const assertStatusOk = statusCode => assert(statusCode < 300, `Expected response code to be in the 200 range but it was ${statusCode}.`);

module.exports = assertStatusOk;
