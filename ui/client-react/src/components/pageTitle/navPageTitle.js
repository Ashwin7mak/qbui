import React, {PropTypes} from 'react';

import PageTitle from '../../../../reuse/client/src/components/pageTitle/pageTitle';
import Locale from '../../../../reuse/client/src/locales/locale';
import {NEW_RECORD_VALUE} from '../../constants/urlConstants';


/**
 * # Nav Page Title
 *
 * A component for the main nav component that updates the page title based on the context
 *
 * The title takes the form:
 * {edit/add record} - {report name} - {title name} - {app name} - QuickBase
 *
 * or if no context provided:
 * {realm name} - Quickbase
 *
 */
const NavPageTitle = React.createClass({
    propTypes: {
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
        editingRecordId: PropTypes.string,

        /**
         * The id of the currently selected record (if viewing a single record)
         */
        selectedRecordId: PropTypes.string
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
        let recordId = this.props.editingRecordId;

        if (recordId && recordId === NEW_RECORD_VALUE) {
            return this.pageTitles.unshift(Locale.getMessage('pageTitles.newRecord'));
        }

        if (recordId) {
            this.pageTitles.unshift(Locale.getMessage('pageTitles.editingRecord', {recordId}));
        }
    },

    addCurrentlyViewingRecordId() {
        let {editingRecordId, selectedRecordId} = this.props;

        if (selectedRecordId && !editingRecordId) {
            this.pageTitles.unshift(Locale.getMessage('pageTitles.viewRecord', {recordId: selectedRecordId}));
        }
    },

    render() {
        this.pageTitles = [];

        // Determine the title based on context if possible
        this.addAppNameToTheTitleIfSelected();
        this.addTableNameToTitleIfSelected();
        this.addReportNameToTheTitleIfSelected();
        this.addCurrentlyEditingRecordId();
        this.addCurrentlyViewingRecordId();

        return <PageTitle title={this.pageTitles.join(Locale.getMessage('pageTitles.pageTitleSeparator'))} />;
    }
});

export default NavPageTitle;
