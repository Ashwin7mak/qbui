import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {exitBuilderMode, closeFieldSelectMenu} from '../../../src/actions/reportActions';
import {CONTEXT} from '../../actions/context';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import Button from 'react-bootstrap/lib/Button';
import {I18nMessage} from '../../utils/i18nMessage';



export class ReportSaveOrCancelFooter extends Component {
    constructor(props) {
        super(props);

    }

    onClickSave() {
        // save report
    };

    onCancel = () => {
        this.props.exitBuilderMode(CONTEXT.REPORT.NAV);
        this.props.closeFieldSelectMenu(CONTEXT.REPORT.NAV);
    };

    getRightAlignedButtons() {
        return (
            <div>
                <Button bsStyle="primary" onClick={this.onCancel} className="cancelFormButton"><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.onClickSave} className="saveFormButton"><I18nMessage message="nav.save"/></Button>
            </div>
        );
    };
    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    };

    render() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAlignedButtons={this.getTrowserActions()}
            leftAlignedButtons={this.getTrowserActions()}
        />;
    };
}

const mapDispatchToProps =(dispatch) => {
    return {
        exitBuilderMode: (context) => dispatch(exitBuilderMode(context)),

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context))
    }
};

export default (connect(null, mapDispatchToProps)(ReportSaveOrCancelFooter));
