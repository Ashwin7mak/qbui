import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import './saveOrCancelFooter.scss';

let SaveOrCancelFooter = React.createClass({
    propTypes: {
        /**
         * left footer actions
         */
        leftActions: React.PropTypes.node,
        /**
         * center footer actions
         */
        centerActions: React.PropTypes.node,
        /**
         * right footer icons
         */
        rightIcons: React.PropTypes.node,
    },

    getTrowserRightIcons() {
        const errorFlg = this.props.hasErrorsAndAttemptedSave ? this.props.hasErrorsAndAttemptedSave() : null;

        const showNext = !!(this.props.reportData && this.props.reportData.nextEditRecordId !== null);

        const errorPopupHidden = this.props.shell ? this.props.shell.errorPopupHidden : true;
        return (
            <div className="saveButtons">
                {errorFlg &&
                <OverlayTrigger placement="top" overlay={<Tooltip id="alertIconTooltip">{errorPopupHidden ? <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.showErrorPopup"/> : <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.closeErrorPopup"/>}</Tooltip>}>
                    <Button className="saveAlertButton" onClick={this.props.toggleErrorDialog}><QBicon icon={"alert"}/></Button>
                </OverlayTrigger>
                }
                {showNext &&
                <Button bsStyle="primary" onClick={this.props.saveAndNextClicked}><I18nMessage message="nav.saveAndNext"/></Button>
                }
                {this.props.recId === null &&
                <Button bsStyle="primary" onClick={() => {this.props.saveClicked(true);}}><I18nMessage message="nav.saveAndAddAnother"/></Button>
                }
                <Button bsStyle="primary" onClick={() => {this.props.saveClicked(false);}}><I18nMessage message="nav.save"/></Button>
            </div>);
    },
    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    },

    render() {
        return (
            <div className="saveOrCancelFooter">
                <div className="leftActions">
                    {this.props.leftActions}
                </div>

                {this.getTrowserActions()}

                <div className="rightIcons">
                    {this.getTrowserRightIcons()}

                </div>
            </div>
        );
    }
});

export default SaveOrCancelFooter;