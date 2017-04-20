import IconUtils from '../../src/components/icon/iconUtils';

let iconsByTag = [
    {
        "tag": "Addresses",
        "icons": [
            "Contact",
            "Location"
        ]
    },
    {
        "tag": "Airplane",
        "icons": [
            "Plane"
        ]
    },
];

describe('IconUtils', () => {

    it('filters no matched icon', () => {

        expect(IconUtils.filterMatches(iconsByTag, "", "anyIcon")).toBe(true);
    });

    it('finds matched icons', () => {

        // matches multiple icons
        expect(IconUtils.filterMatches(iconsByTag, "addresses", "Contact")).toBe(true);
        expect(IconUtils.filterMatches(iconsByTag, "addresses", "Location")).toBe(true);

        // matches substrings
        expect(IconUtils.filterMatches(iconsByTag, "add", "Location")).toBe(true);

        // matches icon name
        expect(IconUtils.filterMatches(iconsByTag, "location", "Location")).toBe(true);
        expect(IconUtils.filterMatches(iconsByTag, "loc", "Location")).toBe(true);
    });

    it('does not matched icon with non-matching filter', () => {

        expect(IconUtils.filterMatches(iconsByTag, "xxx", "Contact")).toBe(false);

        // text not lowercased
        expect(IconUtils.filterMatches(iconsByTag, "Addresses", "Location")).toBe(false);
        expect(IconUtils.filterMatches(iconsByTag, "Location", "Location")).toBe(false);
    });
});
