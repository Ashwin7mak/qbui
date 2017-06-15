const assert = require('assert');
const requestUtils = require('../../src/utility/requestUtils');

const assertStatusOk = statusCode => assert(requestUtils.wasRequestSuccessful(statusCode), `Expected response code to be in the 200 range but it was ${statusCode}.`);

module.exports = assertStatusOk;
