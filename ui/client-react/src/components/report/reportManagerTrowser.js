import React from 'react';
import Fluxxor from 'fluxxor';
import Trowser from "../trowser/trowser";
import ReportManager from "./reportManager";
import {I18nMessage} from "../../utils/i18nMessage";
import Button from 'react-bootstrap/lib/Button';

import QBicon from "../qbIcon/qbIcon";
import TableIcon from "../qbTableIcon/qbTableIcon";

let FluxMixin = Fluxxor.FluxMixin(React);

let ReportManagerTrowser = React.createClass({
    mixins: [FluxMixin],
    /**
     * get trowser content (report nav for now)
     */
    getTrowserContent() {
        let selectReport = (report) => {
            this.hideTrowser();
            setTimeout(() => {
                // give UI transition a moment to execute
                if (this.props.router) {
                    this.props.router.push(report.link);
                }
            },500);
        };

        return <ReportManager reportsData={this.props.reportsData}
                              onSelectReport={selectReport}
                              filterReportsName={this.props.filterReportsName}/>;
    },

    /**
     *  get breadcrumb element for top of trowser
     */
    getTrowserBreadcrumbs() {
        const table = this.props.selectedTable;

        return (
            <h4>
                <TableIcon icon={table ? table.icon : ""}/> {table ? table.name : ""} <QBicon icon="caret-right"/>
                <I18nMessage message={'nav.reportsHeading'}/>
            </h4>);

    },
    /**
     *  get actions element for bottome center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (<div className={"centerActions"}>
            <a href="#"><QBicon icon="add-mini"/><I18nMessage message={'report.newReport'}/></a>
            <a href="#"><QBicon icon="settings"/><I18nMessage message={'report.organizeReports'}/></a>
        </div>);
    },

    getTrowserRightIcons() {
        return (
            <Button bsStyle="primary" onClick={this.hideTrowser}>Done</Button>);
    },

    hideTrowser() {
        let flux = this.getFlux();
        flux.actions.filterReportsByName("");
        flux.actions.hideTrowser();
    },
    /**
     * trowser to wrap report manager
     */
    render() {
        return (
            <Trowser position={"top"}
                     visible={this.props.visible}
                     breadcrumbs={this.getTrowserBreadcrumbs()}
                     centerActions={this.getTrowserActions()}
                     rightIcons={this.getTrowserRightIcons()}
                     onCancel={this.hideTrowser}
                     content={this.getTrowserContent()} />
        );
    }
});

export default ReportManagerTrowser;
