import React from 'react';
import _ from 'lodash';

import DrawerContainer from './drawerContainer';
import {RecordRouteWithUniqueId} from '../record/recordRoute';

// const RecordInDrawer = (props) => (
//     <DrawerContainer {...props}>
//         <RecordRouteWithUniqueId
//             {...props}
//             isDrawerContext={true}
//             hasDrawer={true}
//         />
//     </DrawerContainer>);

class RecordInDrawer extends React.Component {
    componentWillUpdate(nextProps, nextState) {
        console.log(_.differenceWith(this.props, nextProps, _.isEqual));
    }
    componentWillReceiveProps(nextProps) {
        console.log(_.differenceWith(this.props, nextProps, _.isEqual));
    }
    render() {
        return (
            <DrawerContainer {...this.props}>
                <RecordRouteWithUniqueId
                    {...this.props}
                    isDrawerContext={true}
                    hasDrawer={true}
                />
            </DrawerContainer>);
    }
}

export default RecordInDrawer;
