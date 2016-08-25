/**
 * Created by bstookey on 8/25/16.
 */
import React from 'react';
import './cardViewList.scss';

var CardViewFooterNav = React.createClass({
    propTypes: {
        getNextReportPage: React.PropTypes.func,
    },

    /**
     * renders the report footer next button
     */
    render() {
        return (
            <button className="top-card-row field" style = { {width:'400px' } } onClick={this.props.getNextReportPage}> Next page</button>
        );

    }
});

export default CardViewFooterNav;
