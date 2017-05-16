import React from 'react';

import DrawerContainer from './drawerContainer';
import {ReportRouteWithUniqueId} from '../report/reportRoute';

import UrlUtils from '../../utils/urlUtils';

/**
 * Renders a ReportRoute component inside a drawer. See DrawerContainer.
 */
const ReportInDrawer = (props) => (
    <DrawerContainer
        {...props}
        direction="bottom"
        renderBackdrop={false}
        match={props.match}
        pathToAdd={UrlUtils.getReportDrawerSegment(":appId([A-Za-z0-9]+)", ":tblId([A-Za-z0-9]+)", ":rptId([A-Za-z0-9]+)", ":detailKeyFid([A-Za-z0-9]+)", ":detailKeyValue([A-Z-a-z0-9 ]+)")}
    >
        <ReportRouteWithUniqueId
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default ReportInDrawer;
