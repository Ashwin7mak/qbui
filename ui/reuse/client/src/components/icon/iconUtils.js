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
        if (iconName.indexOf(text) !== -1 || text.indexOf(iconName) !== -1) {
            return true;
        }

        // find all tags (sets of icons by name) containing the search text
        const matchedTags = iconsByTag.filter((tagToIcons) => (tagToIcons.tag.toLowerCase().indexOf(text) !== -1) ||
                                                              (text.indexOf(tagToIcons.tag.toLowerCase()) !== -1));

        // filter matches if any tag matching the filter text contains the current icon
        return matchedTags.find((taggedIcons) => taggedIcons.icons.find((taggedIcon) => taggedIcon === icon)) !== undefined;
    },

    /**
     * get title for each icon to use in tooltip
     * @param iconsByTag - array of object which contains tag and icons
     * @param icon - icon name
     * @return {string} icon tooltip string
     */
    getIconToolTipTitle(iconsByTag, icon) {
        // Store all unique title
        let titles = [];
        if (icon && iconsByTag) {
            let iconName = icon.toLowerCase();
            let tagsLength = iconsByTag.length;
            for (let i = 0; i < tagsLength; i++) {
                // Continue the loop if one of the array is empty
                if (iconsByTag[i].icons.length < 0) {
                    continue;
                }
                iconsByTag[i].icons.some(val => {
                    if (iconName === val.toLowerCase()) {
                        // We want the unique name to be in the array
                        if (titles.indexOf(iconsByTag[i].tag) === -1) {
                            // Then push the new title into the array
                            titles.push(iconsByTag[i].tag);
                        }
                    }
                });
            }
        }
        // Desired output string need to be delimited by comma
        return titles.join(', ');
    }
};

export default IconUtils;
