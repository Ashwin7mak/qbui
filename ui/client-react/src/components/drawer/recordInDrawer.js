import React from 'react';
import DrawerContainer from './drawerContainer';
import {RecordRouteWithUniqueId} from '../record/recordRoute';

const RecordInDrawer = (props) => (
    <DrawerContainer
        {...props}
        >
        <RecordRouteWithUniqueId
            {...props}
            isDrawerContext={true}
            hasDrawer={true}
            />
    </DrawerContainer>);

export default RecordInDrawer;
