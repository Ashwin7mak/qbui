/**
 * This bundle contains all the strings needed by the "reuse library" functional area.
 * This bundle is usually loaded by a functional area app in addition to the functional area-specific strings.
 */
export default {
    locales: "en-us",
    currencyCode: "usd",

    messages: {
        test: {
            testMsg: "test",
            testMsg2: "Test message for reuse library - en-us",
            testPluralize: "{value, plural, =0 {0 test} =1 {1 test} other {# tests}}"
        },
        listOfElements: {
            noSearchResults: 'No fields match "{searchText}"',
            searchPlaceholder: "Filter"
        }
    }
};
