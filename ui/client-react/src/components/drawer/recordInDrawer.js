import React from 'react';

import DrawerContainer from './drawerContainer';
import {RecordRouteWithUniqueId} from '../record/recordRoute';

/**
 * Renders a RecordRoute component inside a drawer. See DrawerContainer.
 */
const RecordInDrawer = (props) => (
    <DrawerContainer {...props}>
        <RecordRouteWithUniqueId
            {...props}
            isDrawerContext={true}
            hasDrawer={true}
        />
    </DrawerContainer>);

export default RecordInDrawer;
