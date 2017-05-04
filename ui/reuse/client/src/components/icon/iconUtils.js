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
     * @param icon - icon name
     * @return {string} icon tooltip
     */
    getIconTitle(iconsByTag, icon) {
        let title = [];
        let iconName = icon.toLowerCase();
        let tagsLength = iconsByTag.length;
        if (icon && iconsByTag) {
            for (let i = 0; i < tagsLength; i++) {
                iconsByTag[i].icons.forEach(elem => {
                    if (iconName === elem.toLowerCase()) {
                        if (!title.includes(iconsByTag[i].tag)) {
                            title.push(iconsByTag[i].tag);
                        }
                    }
                });
            }
        }
        return title.join(', ');
    }
};

export default IconUtils;
