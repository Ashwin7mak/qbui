import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {exitBuilderMode, closeFieldSelectMenu, saveReport} from '../../../src/actions/reportActions';
import {CONTEXT} from '../../actions/context';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import Button from 'react-bootstrap/lib/Button';
import {I18nMessage} from '../../utils/i18nMessage';
import {HideAppModal} from '../qbModal/appQbModalFunctions';
import AppHistory from '../../globals/appHistory';


export class ReportSaveOrCancelFooter extends Component {
    constructor(props) {
        super(props);

    }

    onCancel = () => {
        let reportDef = {
            name: this.props.reportData.data.name,
            fids: this.props.reportData.data.fids
        };
        this.props.exitBuilderMode(CONTEXT.REPORT.NAV);
        this.props.closeFieldSelectMenu(CONTEXT.REPORT.NAV);
    };

    onClickSave = () => {
        //HideAppModal();
        let reportDef = {
            name: this.props.reportData.data.name,
            fids: this.props.reportData.data.fids
        };

        this.props.saveReport(this.props.appId, this.props.tblId, this.props.rptId, reportDef);
        this.props.exitBuilderMode(CONTEXT.REPORT.NAV);
        this.props.closeFieldSelectMenu(CONTEXT.REPORT.NAV);
    };


    getRightAlignedButtons() {
        return (
            <div>
                <Button bsStyle="primary" onClick={this.onCancel} className="alternativeTrowserFooterButton"><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.onClickSave} className="mainTrowserFooterButton"><I18nMessage message="nav.save"/></Button>
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

const mapDispatchToProps = (dispatch) => {
    return {
        exitBuilderMode: (context) => dispatch(exitBuilderMode(context)),

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context)),

        saveReport: (context, appId, tblId, rptId, reportDef) => dispatch(saveReport(context, appId, tblId, rptId, reportDef))
    };
};

export default (connect(null, mapDispatchToProps)(ReportSaveOrCancelFooter));
