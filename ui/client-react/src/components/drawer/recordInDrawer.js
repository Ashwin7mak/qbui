import React from 'react';

import DrawerContainer from './drawerContainer';
import {RecordRouteWithUniqueId} from '../record/recordRoute';

import UrlUtils from '../../utils/urlUtils';

/**
 * Renders a RecordRoute component inside a drawer. See DrawerContainer.
 */
const RecordInDrawer = (props) => (
    <DrawerContainer
        {...props}
        pathToAdd={UrlUtils.getRecordDrawerSegment(':appId([A-Za-z0-9]+)', ':tblId([A-Za-z0-9]+)', ':rptId([A-Za-z0-9]+)', ':recordId([A-Za-z0-9]+)')}
    >
        <RecordRouteWithUniqueId
            {...props}
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default RecordInDrawer;
