import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../utils/logger';
import Locale from '../../locales/locales';
import StringUtils from '../../utils/stringUtils';
import {Popover} from 'react-bootstrap';
import OverlayDialogHeader from '../overLay/overlayDialogHeader';
import './sortAndGroup.scss';

let logger = new Logger();

var SortAndGroupDialog = React.createClass({

    propTypes: {
        onClose  : React.PropTypes.func
    },

    render() {
        return (
            <Popover container={this} id="sortAndGroupDialog" className="sortAndGroupDialog"
                                      placement="bottom">
                    <OverlayDialogHeader
                        iconName="sortButton"
                        icon="sort-az"
                        dialogTitleI18N="report.sortAndGroup.header"
                        onCancel={this.props.onClose}
                    />
                     <div>
                         Body here..
                     </div>
            </Popover>
        );
    }
});

export default SortAndGroupDialog;
