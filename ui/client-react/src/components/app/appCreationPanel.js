import React from 'react';
import {PropTypes} from 'react';
import TableFieldInput from '../table/tableFieldInput';
import Locale from '../../locales/locales';
import _ from 'lodash';

import '../table/tableCreationPanel.scss';

class AppCreationPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * render the app settings UI
     * @returns {XML}
     */
    render() {

        return (
            <div className="tableInfo">
                <div className="sections">
                    <TableFieldInput title={Locale.getMessage("appCreation.appNameHeading")}
                                     name="name"
                                     placeholder={Locale.getMessage("appCreation.appNamePlaceHolder")}
                                     required
                                     autofocus />
                </div>
            </div>);
    }
}

AppCreationPanel.propTypes = {
};

export default AppCreationPanel;
