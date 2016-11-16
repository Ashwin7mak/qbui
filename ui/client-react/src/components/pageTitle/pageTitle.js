import React, {PropTypes} from 'react';

import Locale from '../../locales/locales';
import HtmlUtils from '../../utils/htmlUtils';
import {DEFAULT_PAGE_TITLE} from '../../constants/urlConstants';

const PageTitle = React.createClass({
    propTypes: {
        app: PropTypes.object,
        table: PropTypes.object,
        report: PropTypes.object
    },

    addAppNameToTheTitleIfSelected() {
        if (this.props.app) {
            this.pageTitles.unshift(this.props.app.name);
        }
    },

    addReportNameToTheTitleIfSelected() {
        if (this.props.report) {
            this.pageTitles.unshift(this.props.report.name);
        }
    },

    addTableNameToTitleIfSelected() {
        if (this.props.table) {
            this.pageTitles.unshift(this.props.table.name);
        }
    },

    render() {
        // QuickBase is the default page title
        this.pageTitles = [DEFAULT_PAGE_TITLE];

        if (this.props.app) {
            this.addAppNameToTheTitleIfSelected();
            this.addTableNameToTitleIfSelected();
            this.addReportNameToTheTitleIfSelected();
        }

        HtmlUtils.updatePageTitle(this.pageTitles.join(Locale.getMessage('pageTitleSeparator')));

        // This component does not render anything. It only updates the title of the page.
        return null;
    }
});

export default PageTitle;
