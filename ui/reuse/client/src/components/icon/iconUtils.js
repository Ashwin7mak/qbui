
const IconUtils = {

    /**
     * does filter text match icon?
     * @param text lowercase filter text
     * @param icon icon name
     * @returns {boolean}
     */
    filterMatches(iconsByTag, text, icon) {

        if (text === '') {
            // no filter, display all icons
            return true;
        }
        const iconName = icon.toLowerCase();

        // match against icon name
        if (iconName.indexOf(text) !== -1) {
            return true;
        }

        // find all tags (sets of icons by name) containing the search text
        const matchedTags = iconsByTag.filter((tagToIcons) => tagToIcons.tag.toLowerCase().indexOf(text) !== -1);

        // filter matches if any tag matching the filter text contains the current icon
        return matchedTags.find((taggedIcons) => taggedIcons.icons.find((taggedIcon) => taggedIcon === icon)) !== undefined;
    }
};

export default IconUtils;
