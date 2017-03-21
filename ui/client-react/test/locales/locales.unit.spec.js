import Locale, {__RewireAPI__ as LocaleRewireAPI} from '../../src/locales/locales';
import AppsBundleLoader from '../../src/locales/appsBundleLoader';

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

        LocaleRewireAPI.__Rewire__('config', mockConfig);
        LocaleRewireAPI.__Rewire__('locale', '');

        //  default is undefined...sets to default of en-us
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        LocaleRewireAPI.__ResetDependency__('config');
        LocaleRewireAPI.__ResetDependency__('locale');
    });

    it('test getSupportLocales', () => {
        let mockConfig = {
            locale: {
                supported: ['en-us', 'de-de'],
                default: 'en-us',
            }
        };
        LocaleRewireAPI.__Rewire__('config', mockConfig);

        let locales = Locale.getSupportedLocales();
        expect(locales.length).toBe(2);

        LocaleRewireAPI.__ResetDependency__('config');
    });

    it('test valid change locale', () => {
        AppsBundleLoader.changeLocale('fr-fr');
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        AppsBundleLoader.changeLocale('de-de');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('de-de');
        expect(Locale.getLocale()).toBe('de-de');
    });

    it('test getMessage', () => {
        AppsBundleLoader.changeLocale('en-us');
        Locale.getI18nBundle();
        const testMsg = Locale.getMessage("test.testMsg");
        expect(testMsg).toBe('test');
    });

    it('test invalid change locale', () => {
        let mockConfig = {
            locale: {
                supported: ['en-us', 'fr-fr'],
                default: 'en-us',
            }
        };
        LocaleRewireAPI.__Rewire__('config', mockConfig);

        //  set to a valid locale..
        AppsBundleLoader.changeLocale('fr-fr');
        let i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');

        //  .. now set to an invalid locale..locale should not change
        AppsBundleLoader.changeLocale('de-de');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        AppsBundleLoader.changeLocale({'throws exception':2});
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('fr-fr');
        expect(Locale.getLocale()).toBe('fr-fr');

        //  set to a valid locale..
        AppsBundleLoader.changeLocale('en-us');
        i18n = Locale.getI18nBundle();
        expect(i18n.locales).toBe('en-us');

        LocaleRewireAPI.__ResetDependency__('config');
    });
});
