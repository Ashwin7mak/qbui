
import config from '../../src/config/app.config.js';

describe('Logger', () => {
    /*eslint no-console:0 */

    'use strict';

    it('verify configuration with PROD setting', () => {

        expect(config).toBeDefined();

        //  following configuration values are expected to exist
        expect(config.env).toBe('PROD');
        expect(config.api.qbVersion).toBeDefined();
        expect(config.api.nodeVersion).toBeDefined();
        expect(config.logger.logLevel).toBeDefined();
        expect(config.logger.logToConsole).toBeDefined();
        expect(config.logger.logToServer).toBeDefined();
        expect(config.locale.supported).toBeDefined();
        expect(config.locale.default).toBeDefined();
        expect(config.unauthorizedRedirect).toBeDefined();
    });

});
