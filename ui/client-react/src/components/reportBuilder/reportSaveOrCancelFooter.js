import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {exitBuilderMode, saveReport} from '../../../src/actions/reportBuilderActions';
import {CONTEXT} from '../../actions/context';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import Button from 'react-bootstrap/lib/Button';
import {I18nMessage} from '../../utils/i18nMessage';
import NavigationUtils from '../../utils/navigationUtils';
import {HideAppModal} from '../qbModal/appQbModalFunctions';

export class ReportSaveOrCancelFooter extends Component {
    constructor(props) {
        super(props);

    }

    onSave = () => {
        HideAppModal();
        let reportDef = {
            name: this.props.reportData.data.name,
            fids: this.props.reportData.data.fids
        };

        this.props.saveReport(this.props.appId, this.props.tblId, this.props.rptId, reportDef, this.props.redirectRoute);
        this.props.exitBuilderMode();
    };

    closeReportBuilder = () => {
        NavigationUtils.goBackToLocationOrTable(this.props.appId, this.props.tblId, this.props.redirectRoute);
    };

    onCancel = () => {
        this.closeReportBuilder();
        this.props.exitBuilderMode();
    };

    getRightAlignedButtons() {
        return (
            <div>
                <Button bsStyle="primary" onClick={this.onCancel} className="alternativeTrowserFooterButton"><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.onSave} className="mainTrowserFooterButton"><I18nMessage message="nav.save"/></Button>
            </div>
        );
    }
    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    }

    render() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAlignedButtons={this.getTrowserActions()}
            leftAlignedButtons={this.getTrowserActions()}
        />;
    }
}

ReportSaveOrCancelFooter.propTypes = {
    appId: PropTypes.string.isRequired,
    tblId: PropTypes.string.isRequired,
    rptId: PropTypes.string.isRequired,
    reportData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        redirectRoute: state.reportBuilder.redirectRoute
    };
};

const mapDispatchToProps = {
    exitBuilderMode,
    saveReport
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportSaveOrCancelFooter);
