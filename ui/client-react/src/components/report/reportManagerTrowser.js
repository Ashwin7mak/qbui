import React from 'react';
import Trowser from "../trowser/trowser";
import ReportManager from "./reportManager";
import {I18nMessage} from "../../utils/i18nMessage";
import Button from 'react-bootstrap/lib/Button';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import {filterReportsByName} from '../../actions/shellActions';
import {connect} from 'react-redux';


let ReportManagerTrowser = React.createClass({
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
                if (this.props.history) {
                    this.props.history.push(report.link);
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
                <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} classes={"primaryIcon"} icon={table ? table.tableIcon : ""}/>
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
        this.props.filterReportsByName("");
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


const mapStateToProps = (state, ownProps) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        filterReportsByName: (reportName) => dispatch(filterReportsByName(reportName))
    };
};

export {ReportManagerTrowser};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportManagerTrowser);
