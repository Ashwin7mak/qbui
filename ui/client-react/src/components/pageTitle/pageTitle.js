import React, {PropTypes} from 'react';

import Locale from '../../locales/locales';
import HtmlUtils from '../../utils/htmlUtils';
import BaseService from '../../services/baseService';
import {DEFAULT_PAGE_TITLE, NEW_RECORD_VALUE} from '../../constants/urlConstants';

/**
 * # Page Title
 *
 * A component that can alter the page/document title (i.e., the title in the tab at the top of the browser)
 * Logic for contextually identifying the title is included or you can pass in a title that will be used.
 * The title takes the form:
 * {report name} - {title name} - {app name} - QuickBase
 *
 * or if no context provided:
 * {realm name} - Quickbase
 *
 * This component does not render anything to the page. It only updates the page title.
 */
const PageTitle = React.createClass({
    propTypes: {
        /**
         * If provided, this title will be used and the logic for contextually identifying a title will not be used
         */
        title: PropTypes.string,

        /**
         * The currently selected app
         */
        app: PropTypes.object,

        /**
         * The currently selected table
         */
        table: PropTypes.object,

        /**
         * The currently selected report
         */
        report: PropTypes.object,

        /**
         * The id of the record currently being edited
         */
        recordId: PropTypes.string
    },

    /**
     * If an app is selected, add the name to the title
     */
    addAppNameToTheTitleIfSelected() {
        if (this.props.app) {
            this.pageTitles.unshift(this.props.app.name);
        }
    },

    /**
     * If a report is selected, add the name to the title
     */
    addReportNameToTheTitleIfSelected() {
        if (this.props.report) {
            this.pageTitles.unshift(this.props.report.name);
        }
    },

    /**
     * If a table is selected, add the name to the title
     */
    addTableNameToTitleIfSelected() {
        if (this.props.table) {
            this.pageTitles.unshift(this.props.table.name);
        }
    },

    /**
     * If a record is being editing or added, add that info the page title
     */
    addCurrentlyEditingRecordId() {
        let recordId = this.props.recordId;

        if (recordId && recordId === NEW_RECORD_VALUE) {
            return this.pageTitles.unshift(Locale.getMessage('pageTitles.newRecord'));
        }

        if (recordId) {
            this.pageTitles.unshift(Locale.getMessage('pageTitles.editingRecord', {recordId: this.props.recordId}));
        }
    },

    /**
     * If there is no context or page title provided, use the realm in the title of the page
     */
    addRealm() {
        let baseService = new BaseService();
        this.pageTitles.unshift(baseService.getSubdomain());
    },

    /**
     * Updates the page title
     * @returns {null}
     */
    updatePageTitle() {
        let titleString = this.pageTitles.join(Locale.getMessage('pageTitles.pageTitleSeparator'));
        HtmlUtils.updatePageTitle(titleString);
        return null;
    },

    render() {
        // QuickBase is the default page title
        this.pageTitles = [DEFAULT_PAGE_TITLE];

        // Use the title if provided
        if (this.props.title) {
            this.pageTitles.unshift(this.props.title);
            return this.updatePageTitle();
        }

        // Determine the title based on context if possible
        this.addAppNameToTheTitleIfSelected();
        this.addTableNameToTitleIfSelected();
        this.addReportNameToTheTitleIfSelected();
        this.addCurrentlyEditingRecordId();

        // Otherwise, display the realm
        if (!this.props.app && !this.props.table && !this.props.report && !this.props.recordId) {
            this.addRealm();
        }

        return this.updatePageTitle();
    }
});

export default PageTitle;
