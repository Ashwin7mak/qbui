import IconUtils from 'REUSE/components/icon/iconUtils';

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
    {
        "tag": "tag1",
        "icons": [
            "Apple"
        ]
    },
    {
        "tag": "tag2",
        "icons": [
            "aPpLe", "banana"
        ]
    }
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

describe('getIconTooltipTitle', () => {

    it('returns correct string', () => {
        expect(IconUtils.getIconToolTipTitle(iconsByTag, 'apple')).toEqual('tag1, tag2');
    });

    it('handles incorrect parameters', () => {
        expect(IconUtils.getIconToolTipTitle(undefined, undefined)).toEqual('');
    });
});
