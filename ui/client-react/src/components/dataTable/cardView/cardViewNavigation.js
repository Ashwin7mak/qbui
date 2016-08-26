/**
 * Created by bstookey on 8/25/16.
 */
import React from 'react';
import './cardViewList.scss';

var CardViewNavigation = React.createClass({
    propTypes: {
        getNextReportPage: React.PropTypes.func,
    },

    /**
     * renders the report footer next button
     */
    render() {
        return (
            <button className="top-card-row field" style = { {width:'400px' } } onClick={this.props.getPreviousReportPage}> Previous page</button>
        );

    }
});

export default CardViewNavigation;

