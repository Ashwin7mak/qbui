
import config from '../../src/config/app.config.js';

describe('Logger', () => {
    /*eslint no-console:0 */

    'use strict';

    it('verify configuration with TEST setting', () => {

        expect(config).toBeDefined();

        //  following configuration values are expected to exist
        expect(config.env).toBe('TEST');
        expect(config.api.version).toBeDefined();
        expect(config.logger.logLevel).toBeDefined();
        expect(config.logger.logToConsole).toBeDefined();
        expect(config.logger.logToServer).toBeDefined();
        expect(config.locale.supported).toBeDefined();
        expect(config.locale.default).toBeDefined();
    });

});
