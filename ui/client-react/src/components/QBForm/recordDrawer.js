import React, {PropTypes} from 'react';
import withUniqueId from '../hoc/withUniqueId';
import RecordRoute from "../record/recordRoute";
import {CONTEXT} from '../../actions/context';
/**
 * A wrapper for RecordRoutes to be rendered as a drawer
*/
export const RecordDrawerContainer = React.createClass({

    /**
     * Load a record Route
     */
    render() {

        console.log(this.props.params);
        return (
            <div className="drawerContainer">
                <RecordRoute
                    {...this.props}
                   loadContainer={true}
                />
            </div>);
    }
});
export default withUniqueId(RecordDrawerContainer, CONTEXT.FORM.DRAWER);
