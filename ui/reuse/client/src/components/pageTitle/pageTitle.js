import React, {PropTypes} from 'react';

import Locale from '../../locales/locale';

// TEMPORARY IMPORTS FROM CLIENT-REACT
import HtmlUtils from '../../../../../client-react/src/utils/htmlUtils';
import {DEFAULT_PAGE_TITLE} from '../../../../../client-react/src/constants/urlConstants';
import WindowLocationUtils from '../../../../../client-react/src/utils/windowLocationUtils';
import CommonUrlUtils from '../../../../../common/src/commonUrlUtils';
// TEMPORARY IMPORTS FROM CLIENT-REACT

/**
 * # Page Title
 *
 * A component that can alter the page/document title (i.e., the title in the tab at the top of the browser)
 *
 */
const PageTitle = React.createClass({
    propTypes: {
        /**
         * The new title of the page. If not provided, only the realm and default title will be displayed.
         * The default title is always appended at the end.
         */
        title: PropTypes.string
    },

    /**
     * If there is no context or page title provided, use the realm in the title of the page
     */
    addRealm() {
        let hostname = WindowLocationUtils.getHostname();
        this.pageTitles.unshift(CommonUrlUtils.getSubdomain(hostname));
    },

    /**
     * Updates the page title
     * @returns {null}
     */
    updatePageTitle() {
        let titleString = this.pageTitles.join(Locale.getMessage('pageTitles.pageTitleSeparator'));
        HtmlUtils.updatePageTitle(titleString);
        // This component does not render anything to the page. React requires null is returned.
        return null;
    },

    render() {
        // QuickBase is the default page title
        this.pageTitles = [DEFAULT_PAGE_TITLE];

        // Add the realm if no title is provided
        if (!this.props.title || this.props.title === '') {
            this.addRealm();
        } else {
            this.pageTitles.unshift(this.props.title);
        }

        return this.updatePageTitle();
    }
});

export default PageTitle;
