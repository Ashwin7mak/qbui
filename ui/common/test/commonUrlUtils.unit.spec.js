var assert = require('assert');
var commonUrlUtils = require('../src/commonUrlUtils');

/**
 * Unit tests for Common Cookie Utility Functions
 */

describe('Test Common URL Utils Functions', () => {

    var simpleSubdomain = {hostname: "team.quickbase.com", subdomain: "team", domain: "quickbase.com"};
    var complexSubdomain = {hostname: "team.demo.quickbaserocks.com", subdomain: "team", domain: "quickbaserocks.com"};


    it('test getSubdomain method with simple subdomain', () => {
        var subdomain = commonUrlUtils.getSubdomain(simpleSubdomain.hostname);
        assert.equal(subdomain, simpleSubdomain.subdomain);
    });

    it('test getDomain method with simple subdomain', () => {
        var domain = commonUrlUtils.getDomain(simpleSubdomain.hostname);
        assert.equal(domain, simpleSubdomain.domain);
    });

    it('test getSubdomain method with complex subdomain', () => {
        var subdomain = commonUrlUtils.getSubdomain(complexSubdomain.hostname);
        assert.equal(subdomain, complexSubdomain.subdomain);
    });

    it('test getDomain method with complex subdomain', () => {
        var domain = commonUrlUtils.getDomain(complexSubdomain.hostname);
        assert.equal(domain, complexSubdomain.domain);
    });


});

