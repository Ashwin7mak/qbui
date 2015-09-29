import { Locale, getI18nBundle, changeLocale }from '../../src/locales/locales';

describe('Locales', () => {
    'use strict';

    it('test getI18nBundle', () => {
        let i18n = getI18nBundle();
        expect(i18n.locales).toBe('en-us');
    });

    it('test change locale', () => {
        let i18n = getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        changeLocale('fr-fr');
        i18n = getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');

        changeLocale('de-de');
        i18n = getI18nBundle();
        expect(i18n.locales).toBe('de-de');

        changeLocale('invalid');
        i18n = getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        changeLocale({'throws exception':2});
        i18n = getI18nBundle();
        expect(i18n.locales).toBe('en-us');
    });
});