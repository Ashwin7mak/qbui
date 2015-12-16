import React from 'react';
import Griddle from 'griddle-react';

//import Logger from '../../../utils/logger';
//var logger = new Logger();
import {I18nMessage} from '../../../utils/i18nMessage';
import * as breakpoints from '../../../constants/breakpoints';
import './griddleTable.css';
import './qbGriddleTable.scss';

import CardView from './cardView.js';

/*
 * Sample component looks like  -
 * <GriddleTable results={fakeGriddleData} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 * */


class GriddleTable extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        if (this.props.results) {
            return (
                <div>
                    <Griddle {...this.props}
                        results={this.props.results}
                        useCustomRowComponent={this.context.breakpoint === breakpoints.SMALL_BREAKPOINT}
                        />
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
