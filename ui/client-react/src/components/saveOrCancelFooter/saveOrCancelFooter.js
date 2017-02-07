import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import './saveOrCancelFooter.scss';

let SaveOrCancelFooter = React.createClass({
    propTypes: {
        /**
         * left footer actions
         */
        leftActions: React.PropTypes.node,
        /**
         * center footer actions
         */
        centerActions: React.PropTypes.node,
        /**
         * right footer icons
         */
        rightIcons: React.PropTypes.node,
    },
    render() {
        return (
            <div className="saveOrCancelFooter">
                <div className="leftActions">
                    {this.props.leftActions}
                </div>

                {this.props.centerActions}

                <div className="rightIcons">
                    {this.props.rightIcons}

                </div>
            </div>
        );
    }
});

export default SaveOrCancelFooter;