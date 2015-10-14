import Locale from '../../src/locales/locales';

describe('Locales', () => {
    'use strict';

    it('test getI18nBundle', () => {
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');
    });

    it('test valid change locale', () => {
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');
        expect(Locale.getLocale()).toBe('en-us');

        Locale.changeLocale('fr-fr');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        Locale.changeLocale('de-de');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('de-de');
        expect(Locale.getLocale()).toBe('de-de');
    });

    it('test invalid change locale', () => {
        //  set to a valid locale..
        Locale.changeLocale('fr-fr');

        //  .. now set to an invalid locale..should use existing
        Locale.changeLocale('invalid');
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        Locale.changeLocale({'throws exception':2});
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');
    });
});