import React from 'react';

import DrawerContainer from './drawerContainer';
import {ReportRouteWithUniqueId} from '../report/reportRoute';

import {DRAWER} from '../../constants/urlConstants';

/**
 * Renders a ReportRoute component inside a drawer. See DrawerContainer.
 */
const ReportInDrawer = (props) => (
    <DrawerContainer
        {...props}
        direction="bottom"
        renderBackdrop={false}
        match={props.match}
        pathToAdd={DRAWER.REPORT_SEGMENT_PATH}
    >
        <ReportRouteWithUniqueId
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default ReportInDrawer;
