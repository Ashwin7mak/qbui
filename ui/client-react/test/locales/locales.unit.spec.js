import Locale from '../../src/locales/locales';

describe('Locales', () => {
    'use strict';

    it('test getI18nBundle', () => {
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');
    });

    it('test change locale', () => {
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        Locale.changeLocale('fr-fr');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        Locale.changeLocale('de-de');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('de-de');
        expect(Locale.getLocale()).toBe('de-de');

        Locale.changeLocale('invalid');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');
        expect(Locale.getLocale()).toBe('invalid');

        Locale.changeLocale({'throws exception':2});
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');
    });
});