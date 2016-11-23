/**
 * A service to wrap direct calls to html modification for easier testing/mocking.
 */
const HtmlUtils = {
    updatePageTitle(title) {
        document.title = title;
    }
};

export default HtmlUtils;
