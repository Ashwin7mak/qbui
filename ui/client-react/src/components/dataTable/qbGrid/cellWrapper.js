import React from 'react';
import _ from 'lodash';
export const ACTION_COLUMN_CLASSNAME = 'actionsCol';
export const EMPTY_ACTION_COLUMN_CLASSNAME = 'emptyRowActions';
export const ROW_EDIT_ACTIONS_CLASSNAME = 'editTools';
const ELEMENT_CLASSES = [ACTION_COLUMN_CLASSNAME, EMPTY_ACTION_COLUMN_CLASSNAME, ROW_EDIT_ACTIONS_CLASSNAME];

/**
 * The purpose of this wrapper is to pass the props of the cell renderer to the element. In Reactabular, the props for a cell come in
 * as this.props.children, which might be a confusing API to developers used to passing in things to this.props. Therefore, if the
 * component is one we are using only on Reactabular, we can render it as normal for Reactabular (currently only the first row actions column)
 * otherwise, we will pass this.props.children down to the cell renderer as normal props.
 * TODO:: Perhaps my implementation is somewhat off. There may be a way to get around doing this. If so, we should switch to that.
 * @param CellComponent
 * @returns {*}
 * @constructor
 */
const CellWrapper = (CellComponent) => {
    return React.createClass({
        render() {
            let childClassName = (_.has(this.props, 'children.props.className') ? this.props.children.props.className : null);
            let isGridComponent = (_.has(this.props, 'children.props.gridComponent') ? this.props.children.props.gridComponent : false);
            if (isGridComponent || ELEMENT_CLASSES.includes(childClassName)) {
                return <td {...this.props}/>;
            }

            return <CellComponent {...this.props.children} />;
        }
    });
};

export default CellWrapper;
