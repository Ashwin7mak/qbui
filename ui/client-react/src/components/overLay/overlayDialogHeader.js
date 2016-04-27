import React from 'react';

import Fluxxor from 'fluxxor';
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import './overlay.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OverlayDialogHeader = React.createClass({

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
