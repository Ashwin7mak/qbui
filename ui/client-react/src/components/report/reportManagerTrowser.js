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

    propTypes: {
        visible: React.PropTypes.bool,
        reportsData: React.PropTypes.object,
        filterReportsName: React.PropTypes.string,
        selectedTable: React.PropTypes.object
    },
    /**
     * get trowser content
     */
    getTrowserContent() {
        let selectReport = (report) => {
            this.hideTrowser();
            setTimeout(() => {
                // give UI transition a moment to execute
                if (this.props.router) {
                    this.props.router.push(report.link);
                }
            }, 500);
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
            <div className="breadcrumbsContent">
                <TableIcon classes={"primaryIcon"} icon={table ? table.icon : ""}/>
                <span>{table ? table.name : ""}</span>
                <span> : </span>
                <I18nMessage message={'nav.reportsHeading'}/>
            </div>);

    },
    /**
     *  get actions element for bottome center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return <div className={"centerActions"} />;
    },

    getTrowserRightIcons() {
        return (
            <Button bsStyle="primary" onClick={this.hideTrowser}>Done</Button>);
    },

    hideTrowser() {
        let flux = this.getFlux();
        flux.actions.filterReportsByName("");
        this.props.onHideTrowser();
    },
    /**
     * trowser to wrap report manager
     */
    render() {
        return (
            <Trowser position="top"
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
