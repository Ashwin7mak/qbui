import React from 'react';

import DrawerContainer from './drawerContainer';
import {RecordRouteWithUniqueId} from '../record/recordRoute';

import {DRAWER} from '../../constants/urlConstants';

/**
 * Renders a RecordRoute component inside a drawer. See DrawerContainer.
 */
const RecordInDrawer = (props) => (
    <DrawerContainer
        {...props}
        pathToAdd={DRAWER.RECORD_SEGMENT_PATH}
    >
        <RecordRouteWithUniqueId
            {...props}
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default RecordInDrawer;
