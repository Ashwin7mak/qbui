import React, {PropTypes} from 'react';
import _ from 'lodash';

import Drawer from './drawer';
import {RecordRouteWithUniqueId} from '../../components/record/recordRoute';

import './drawer.scss';

/**
 * A parent component which orchestrates stacks of drawers.
 */
class DrawerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {addedDrawers: []};
    }

    getDrawers = () => {
        // TODO: handle all the records in url since we'll support multiple drawers
        //       the array or tables/records should not be passed in as props, we should retrieve
        //       or generate the list of records from the router
        const drawerTableIds = _.get(this, 'props.drawerTableIds');
        let drawerRecordIds = _.get(this, 'props.drawerRecordIds');
        drawerRecordIds = drawerRecordIds.concat(this.state.addedDrawers);

        if (drawerTableIds.length && drawerRecordIds.length) {
            return drawerRecordIds.map(drawerRecordId => {
                return (
                    <Drawer visible={true} key={drawerRecordId} keyboardOnCancel={()=> {console.log('hey');}}>
                        <RecordRouteWithUniqueId {...this.props} isDrawerContext={true}/>
                    </Drawer>);
            });
        } else {
            return null;
        }
    };

    closeDrawers = () => {
        // TODO: probably a router-type thing to close all the drawers
    };

    // TODO: remove this function, this is temporary
    addDrawers = () => {
        const drawers = this.state.addedDrawers;
        drawers.push(_.uniqueId());
        this.setState({addedDrawers: drawers});
    };

    // TODO: remove this function, this is temporary
    removeDrawers = () => {
        this.setState({addedDrawers: []});
    };

    // TODO: pass a closeDrawers function to drawers, drawers pass close button as a prop to
    //       RecordWrapper, RecordWrapper renders button. YES!
    render() {
        const classNames = ['drawerContainer', this.props.position];
        classNames.push(this.props.visible ? 'visible' : '');
        return (
            <div className={classNames.join(' ')} onClick={this.closeDrawers}>
                <button className="moreDrawers" onClick={this.addDrawers} >add</button>
                <button className="moreDrawers" onClick={this.removeDrawers} >remove</button>
                {this.getDrawers()}
                {this.props.content}
                {this.props.children}
            </div>
        );
    }
}

DrawerContainer.propTypes = {
    /** whether the DrawerContainer is visible */
    visible: PropTypes.bool.isRequired,
    /** main content of DrawerContainer */
    content: PropTypes.node,
};

export default DrawerContainer;
