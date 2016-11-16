import React, {PropTypes} from 'react';
import Fluxxor from 'fluxxor';
import _ from 'lodash';

import Locale from '../../locales/locales';
import HtmlUtils from '../../utils/htmlUtils';
import {DEFAULT_PAGE_TITLE} from '../../constants/urlConstants';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

const PageTitle = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('AppsStore', 'ReportDataStore', 'FormStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            apps: flux.store('AppsStore').getState(),
            reportData: flux.store('ReportDataStore').getState(),
            form: flux.store('FormStore').getState()
        };
    },

    anAppIsSelected() {
        return (this.state.apps.apps.length && this.state.apps.selectedAppId);
    },

    selectedApp() {
        if (this.anAppIsSelected()) {
            if (!this.app) {
                this.app = _.find(this.state.apps.apps, {id: this.state.apps.selectedAppId})
            }
            return this.app;
        }

        return null;
    },

    addAppNameToTheTitleIfSelected() {
        if (this.selectedApp()) {
            this.pageTitles.unshift(this.selectedApp().name);
        }
    },

    aReportIsSelected() {
        let reportData = this.state.reportData;
        return (reportData.rptId && reportData.data && reportData.data.name);
    },

    addReportNameToTheTitleIfSelected() {
        if (this.aReportIsSelected()) {
            this.pageTitles.unshift(this.state.reportData.data.name);
        }
    },

    aTableIsSelected() {
        return (this.state.apps.selectedTableId);
    },

    addTableNameToTitleIfSelected() {
        if (this.aTableIsSelected()) {
            let table = _.find(this.app.tables, {id: this.state.apps.selectedTableId});

            if (table) {
                this.pageTitles.unshift(table.name);
            }
        }
    },

    render() {
        // QuickBase is the default page title
        this.pageTitles = [DEFAULT_PAGE_TITLE];

        if (this.anAppIsSelected()) {
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
