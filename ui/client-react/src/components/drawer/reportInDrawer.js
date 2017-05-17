import React from 'react';

import DrawerContainer from './drawerContainer';
import {ReportRouteWithViewId} from '../report/reportRoute';

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
        <ReportRouteWithViewId
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default ReportInDrawer;
