import React from 'react';
import './saveOrCancelFooter.scss';

let SaveOrCancelFooter = React.createClass({
    propTypes: {
        /**
         * left footer actions
         */
        leftAligendBUttons: React.PropTypes.node,
        /**
         * center footer actions
         */
        centerAligendButtons: React.PropTypes.node,
        /**
         * right footer icons
         */
        rightAlignedButtons: React.PropTypes.node,
    },


    render() {
        return (
            <div className="saveOrCancelFooter">
                <div className="leftActions">
                    {this.props.leftAligendBUttons}
                </div>

                {this.props.centerAligendButtons}

                <div className="rightIcons">
                    {this.props.rightAlignedButtons}

                </div>
            </div>
        );
    }
});

export default SaveOrCancelFooter;