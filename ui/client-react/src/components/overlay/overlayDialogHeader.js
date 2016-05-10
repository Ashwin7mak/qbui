import React from 'react';

import Fluxxor from 'fluxxor';
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
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
        icon: React.PropTypes.string

    },


    renderTitle() {
        return (
        <h5 className="overlayTitle overlayCenter">
            <I18nMessage message={this.props.dialogTitleI18N} />
        </h5>
        );
    },
    smallHeaderRender() {
        return (
            <div className="overlayDialogHeader smallHeader">
                <div className="overlayLeft">
                    <Button onClick={this.props.onCancel}><QBicon icon={"close"}/></Button>
                </div>

                {this.renderTitle()}

                <div className="overlayLeft">
                    <Button className={this.props.dirty} onClick={this.props.onApply}>
                    <I18nMessage message="apply"/>
                    </Button>
                </div>
            </div>
        );
    },

    nonSmallHeaderRender() {
        return (
            <div className="overlayDialogHeader nonSmallHeader">
                <div className="overlayLeft">
                            <Button className={this.props.iconName + "Span" }
                                    onClick={this.props.onCancel}>
                                <QBicon className={this.props.iconName}
                                        icon={this.props.icon}  />
                            </Button>
                </div>

                {this.renderTitle()}

                <div className="overlayRight">
                    <Button onClick={this.props.onCancel}><QBicon icon={"close"}/></Button>
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
