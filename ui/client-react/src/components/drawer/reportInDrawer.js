import React from 'react';

import DrawerContainer from './drawerContainer';
import {ReportRouteWithUniqueId} from '../report/reportRoute';

/**
 * Renders a ReportRoute component inside a drawer. See DrawerContainer.
 */
const ReportInDrawer = (props) => (
    <DrawerContainer
        direction="bottom"
        renderBackdrop={false}
        rootDrawer={!props.isDrawerContext}
        pathToAdd="/sr_report_app_:appId([A-Za-z0-9]+)_table_:tblId([A-Za-z0-9]+)_report_:rptId([A-Za-z0-9]+)_dtFid_:detailKeyFid([A-Za-z0-9]+)_dtVal_:detailKeyValue([A-Z-a-z0-9]+)"
    >
        <ReportRouteWithUniqueId
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default ReportInDrawer;
