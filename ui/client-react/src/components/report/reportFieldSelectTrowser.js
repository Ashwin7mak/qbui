import React, {Component} from 'react';
import SideMenuBase, {SideMenuBaseProps} from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';

import './reportFieldSelectTrowser.scss';

class ReportFieldSelectTrowser extends Component {
    render() {
        return (
            <SideMenuBase {...this.props} baseClass="reportFieldSelectTrowser"/>
        );
    }
}

ReportFieldSelectTrowser.propTypes = {
    ...SideMenuBaseProps
};

export default ReportFieldSelectTrowser;