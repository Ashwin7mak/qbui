import React, {PropTypes} from 'react';
import _ from 'lodash';

import Drawer from './drawer';
import {RecordRouteWithUniqueId} from '../../components/record/recordRoute';
import './drawer.scss';

/**
 *
 */
class DrawerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {addedDrawers: []};
    }
    // TODO:
    // - get all drawers from url or passed in via parent
    // - render drawer's inner component, RecordWrapper
    //
    getDrawers = () => {
        // TODO: handle all the records in url since we'll support multiple
        const drawerTableIds = _.get(this, 'props.drawerTableIds');
        let drawerRecordIds = _.get(this, 'props.drawerRecordIds');
        drawerRecordIds = drawerRecordIds.concat(this.state.addedDrawers);

        if (drawerTableIds.length && drawerRecordIds.length) {
            const appId = this.props.appId;
            const map =  drawerRecordIds.map(drawerRecordId => {
                return (
                    <Drawer visible={true} key={drawerRecordId} keyboardOnCancel={()=> {console.log('hey');}}>
                        {/* TODO: render RecordWrapper*/}
                        <RecordRouteWithUniqueId {...this.props} loadDrawerContainer={true}/>
                    </Drawer>);
            });
            return map;
        } else {
            return null;
        }
    }

    // TODO: remove this function, this is temporary
    addDrawers = () => {
        const drawers = this.state.addedDrawers;
        drawers.push(_.uniqueId());
        this.setState({addedDrawers: drawers});
    }

    // TODO: render a 'Close' button, probably a <Link> component and pass to child
    //       OR pass a closeDrawers function to drawers, drawers pass close button as a prop to
    //          RecordWrapper, RecordWrapper renders button. YES!
    render() {
        const classNames = ['drawerContainer', this.props.position];
        classNames.push(this.props.visible ? 'visible' : '');
        return (
            <div className={classNames.join(' ')} onClick={this.closeDrawers}>
                <button className="moreDrawers" onClick={this.addDrawers} />
                {this.getDrawers()}
                {this.props.content}
                {this.props.children}
            </div>
        );
    }
}

DrawerContainer.propTypes = {
    /** whether the DrawerContainer is be visible */
    visible: PropTypes.bool.isRequired,
    /** main content of DrawerContainer */
    content: PropTypes.node,
    /** position of the DrawerContainer, defaults to 'right' */
    position: PropTypes.oneOf(['left', 'right', 'top', 'bottom'])

};

DrawerContainer.defaultProps = {
    position: 'right'
};


export default DrawerContainer;
