import React from 'react';

import Fluxxor from 'fluxxor';
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import Breakpoints from '../../utils/breakpoints';
import './overlay.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OverlayDialogHeader = React.createClass({

    smallHeaderRender() {
        return (
            <div>TBD..</div>
        );
    },

    nonSmallHeaderRender() {
        return (
            <div className="overlayDialogHeader">
                <div className="overlayLeft">
                            <Button className={this.props.iconName + "Span" }
                                    onClick={this.props.onCancel}>
                                <QBicon className={this.props.iconName}
                                        icon={this.props.icon}  />
                            </Button>
                </div>

                <div className="overlayTitle overlayCenter">
                    <I18nMessage message={this.props.dialogTitleI18N} />
                </div>

                <div className="overlayRight">
                    <Button onClick={this.props.onCancel}><QBicon icon={"close"}/></Button>
                </div>
            </div>
        );
    },

    render() {
        if (Breakpoints.isSmallBreakpoint()) {
            return this.smallHeaderRender();
        } else {
            return this.nonSmallHeaderRender();
        }
    }
});

export default OverlayDialogHeader;
