import React from 'react';
import _ from 'lodash';

import DrawerContainer from './drawerContainer';
import {ReportRouteWithUniqueId} from '../report/reportRoute';

class ReportInDrawer extends React.Component {
    componentWillUpdate(nextProps, nextState) {
        console.log(_.differenceWith(this.props, nextProps, _.isEqual));
    }
    componentWillReceiveProps(nextProps) {
        console.log(_.differenceWith(this.props, nextProps, _.isEqual));
    }
    render() {
        return (
            <DrawerContainer
                direction="bottom"
                renderBackdrop={false}
                rootDrawer={!this.props.isDrawerContext}
                pathToAdd="/sr_report_app_:appId([A-Za-z0-9]+)_table_:tblId([A-Za-z0-9]+)_report_:rptId([A-Za-z0-9]+)_dtFid_:detailKeyFid([A-Za-z0-9]+)_dtVal_:detailKeyValue([A-Z-a-z0-9]+)"
            >
                <ReportRouteWithUniqueId
                    isDrawerContext={true}
                    hasDrawer={true}
                />
            </DrawerContainer>);
    }
}

export default ReportInDrawer;
