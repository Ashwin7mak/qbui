import Locale from '../../src/locales/locales';

describe('Locales', () => {
    'use strict';

    it('test getI18nBundle default bundle using environment settings(PROD)', () => {
        expect(Locale.getLocale()).toBe('en-us');
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');
    });

    it('test invalid default locale', () => {
        let mockConfig = {
            locale: {
                supported: ['en-us', 'fr-fr'],
                default: null,
            }
        };

        Locale.__Rewire__('config', mockConfig);
        Locale.__Rewire__('locale', '');

        //  default is undefined...sets to default of en-us
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        Locale.__ResetDependency__('config');
        Locale.__ResetDependency__('locale');
    });

    it('test getSupportLocales', () => {
        let mockConfig = {
            locale: {
                supported: ['en-us', 'de-de'],
                default: 'en-us',
            }
        };
        Locale.__Rewire__('config', mockConfig);

        let locales = Locale.getSupportedLocales();
        expect(locales.length).toBe(2);

        Locale.__ResetDependency__('config');
    });

    it('test valid change locale', () => {
        Locale.changeLocale('fr-fr');
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        Locale.changeLocale('de-de');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('de-de');
        expect(Locale.getLocale()).toBe('de-de');
    });

    it('test invalid change locale', () => {
        let mockConfig = {
            locale: {
                supported: ['en-us', 'fr-fr'],
                default: 'en-us',
            }
        };
        Locale.__Rewire__('config', mockConfig);

        //  set to a valid locale..
        Locale.changeLocale('fr-fr');
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');

        //  .. now set to an invalid locale..locale should not change
        Locale.changeLocale('de-de');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        Locale.changeLocale({'throws exception':2});
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        //  set to a valid locale..
        Locale.changeLocale('en-us');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        Locale.__ResetDependency__('config');
    });
});
