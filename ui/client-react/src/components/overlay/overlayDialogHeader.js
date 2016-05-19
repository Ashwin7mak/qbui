import React from 'react';

import Fluxxor from 'fluxxor';
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import './overlay.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;


/**
 * Component for rendering the actions of a popover with apply/close/cancel
 * layout for small and large/medium size form factors
 * @type {ClassicComponentClass<P>}
 */
var OverlayDialogHeader = React.createClass({

    propTypes: {
        //key to lookup globalized title for the modal dialog
        dialogTitleI18N: React.PropTypes.string,

        //callback it is to use when cancelling out of the modal dialog
        onCancel: React.PropTypes.func,

        //callback it is to use when applying changes from modal dialog
        onApply: React.PropTypes.func,

        //string to add to the apply button class to indicate the settings
        //in the dialog are not yet applied (dirty)
        dirty: React.PropTypes.string,

        // the class name for button to use in the upper left title of the
        // modal in non small, usually same icon as used to launch
        // the dialog for cancelling - see xd spec sort&group
        iconName: React.PropTypes.string,

        // the name of the icon of button to use in the upper left title of the
        // modal in non small, usually same icon as used to launch
        // the dialog for cancelling - see xd spec sort&group
        icon: React.PropTypes.string,

        // message to use for icon tootip
        iconI18nMessageKey: React.PropTypes.string

    },


    renderTitle() {
        return (
        <h5 className="overlayTitle overlayCenter">
            <I18nMessage message={this.props.dialogTitleI18N} />
        </h5>
        );
    },
    smallHeaderRender() {
        let buttonClassName =  "action applyButton";
        buttonClassName += (this.props.dirty ? " dirty" : "");
        return (
            <div className="overlayDialogHeader smallHeader">
                <div className="overlayLeft">
                    <QBToolTip location="bottom" tipId="cancelSrtGrpIcon"
                               i18nMessageKey="cancelTip">
                        <Button onClick={this.props.onCancel}
                                className="action"><QBicon icon={"close"}/>
                        </Button>
                    </QBToolTip>
                </div>

                {this.renderTitle()}

                <div className="overlayLeft">
                    <QBToolTip location="bottom" tipId="applySrtGrpIcon"
                               i18nMessageKey="applyTip">
                            <Button className={buttonClassName} onClick={this.props.onApplyChanges}>
                        <I18nMessage message="apply"/>
                        </Button>
                    </QBToolTip>
                </div>
            </div>
        );
    },

    nonSmallHeaderRender() {
        return (
            <div className="overlayDialogHeader nonSmallHeader">
                <div className="overlayLeft">
                    <QBToolTip location="top" tipId="cancelSrtGrpIcon"
                               i18nMessageKey="cancelTip">
                            <Button className={this.props.iconName + "Span" }
                                    onClick={this.props.onCancel}>
                                <QBicon className={this.props.iconName + " action"}
                                        icon={this.props.icon}  />
                            </Button>
                    </QBToolTip>
                </div>

                {this.renderTitle()}

                <div className="overlayRight">
                    <QBToolTip location="top" tipId="cancelSrtGrpIcon"
                               i18nMessageKey="cancelTip">
                    <Button onClick={this.props.onCancel} ><QBicon icon={"close"} className="action"/></Button>
                    </QBToolTip>
                </div>
            </div>
        );
    },

    render() {
        return (
        <div>
            {this.smallHeaderRender()}
            {this.nonSmallHeaderRender()}
        </div>
        );
    }
});

export default OverlayDialogHeader;
