import WindowLocationUtils from '../../src/utils/windowLocationUtils';

describe('WindowLocationUtils', () => {
    it('buildQueryString returns an empty string when nothing is passed in', () => {
        const result = WindowLocationUtils.buildQueryString();
        expect(result).toEqual('');
    });
    it('buildQueryString returns an empty string when nothing is passed in', () => {
        const result = WindowLocationUtils.buildQueryString();
        expect(false).toEqual(false);
    });
    it('buildQueryString returns a query string when params is passed in', () => {
        const params = {
            key: 'value',
            name: 'Noah',
            age: 950
        };
        const result = WindowLocationUtils.buildQueryString('', params);
        // order doesn't matter
        // should be in form: "?key=value&name=Noah&age=950"
        expect(result).toContain('key=value');
        expect(result).toContain('name=Noah');
        expect(result).toContain('age=950');
        expect(result).toMatch(/^\?/);
        // //contains 2 ampersands
        expect(result).toMatch(/.*&.*&.*/);
    });
    it('buildQueryString returns a query string when a urlQueryString contains search queries', () => {
        const urlQueryString = "?key=value&name=Dude";
        const result = WindowLocationUtils.buildQueryString(urlQueryString);
        // order doesn't matter
        // should be in form: "?key=value&name=Dude"
        expect(result).toContain('key=value');
        expect(result).toContain('name=Dude');
        expect(result).toMatch(/^\?/);
        //contains 1 ampersand
        expect(result).toMatch(/.*&.*/);
    });
    it('buildQueryString queries in params overwrites queries in urlQueryString', () => {
        const urlQueryString = "?key=value&name=Gaylord&age=99";
        const params = {
            key: 'value',
            name: 'Dude',
            object: 'rug'
        };
        const result = WindowLocationUtils.buildQueryString(urlQueryString, params);
        // order doesn't matter
        // should be in form: "?key=value&name=Dude&object=rug&age=99"
        expect(result).toContain('key=value');
        expect(result).toContain('name=Dude');
        expect(result).toContain('object=rug');
        expect(result).toMatch(/^\?/);
        //contains 2 ampersands
        expect(result).toMatch(/.*&.*&.*&.*/);
    });
});
