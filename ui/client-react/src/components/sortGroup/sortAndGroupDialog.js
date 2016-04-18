import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../utils/logger';
import Locale from '../../locales/locales';
import StringUtils from '../../utils/stringUtils';
import {Popover} from 'react-bootstrap';
import './sortAndGroup.scss';

let logger = new Logger();

var SortAndGroupDialog = React.createClass({

    propTypes: {
        onClose  : React.PropTypes.func
    },

    render() {
        return (
            <Popover container={this} className="sortAndGroupDialog"
                                      placement="bottom">
                     <div>
                         <Button onClick={()=>this.props.onClose()}>Close</Button>
                     </div>
            </Popover>
    );
    }
});


export default SortAndGroupDialog;
