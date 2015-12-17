import React from 'react';
import Griddle from 'griddle-react';

import {I18nMessage} from '../../../utils/i18nMessage';
import * as breakpoints from '../../../constants/breakpoints';
import './griddleTable.css';
import './qbGriddleTable.scss';
import ReportActions from '../../report/dataTable/reportActions';
import CardView from './cardView.js';

/*
 * Sample component looks like  -
 * <GriddleTable results={fakeGriddleData} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 * */

class GriddleTable extends React.Component {

    constructor(...args) {
        super(...args);

        this.state = {
            selectedRows: []
        };

        this.onTableClick = this.onTableClick.bind(this);
    }


    /**
     * since Griddle is a half-baked piece of junk we need to get selected rows
     * via a ref and also give griddle a chance to update the selected list before we ask for it...
     */
    onTableClick() {
        setTimeout(() => {
            this.setState({selectedRows: this.refs.griddleTable.getSelectedRowIds()});
        }, 0);
    }

    render() {

        if (this.props.results) {
            return (
                <div className="reportTable" >

                    {/* add actions component if present, passing in selected row count prop */}
                    {this.props.actions && React.cloneElement(this.props.actions, {selection: this.state.selectedRows})}

                    <div onClick={this.onTableClick}>
                        <Griddle {...this.props}
                            ref="griddleTable"
                            isMultipleSelection={true}
                            selectedRowIds={this.state.selectedRows}
                            uniqueIdentifier={this.props.uniqueIdentifier}
                            results={this.props.results}
                            useCustomRowComponent={this.context.breakpoint === breakpoints.SMALL_BREAKPOINT}
                            />
                    </div>
                </div>
            );
        } else {
            return (
                <div><I18nMessage message={'grid.no_data'}/></div>
            );
        }
    }
}
GriddleTable.contextTypes = {
    breakpoint: React.PropTypes.string
};

GriddleTable.propTypes = {  };
GriddleTable.defaultProps = {
    mobile: false,
    showFilter: false,
    showSettings: false,
    currentPage: 0,
    resultsPerPage: 1000,
    useCustomRowComponent: false,
    customRowComponent: CardView,
    customRowComponentClassName: "custom-row",

    useExternal: false, /* this should always be false for us since the store takes care of just sending the data thats to be rendered at any point in time */
    columnMetadata: [],
    results: [],

    gridClassName: 'QBGriddle',
    useGriddleStyles: false,
    sortAscendingClassName: "Sorted",
    sortDescendingClassName: "Sorted"
};

export default GriddleTable;
