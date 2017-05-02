import React from 'react';
import './saveOrCancelFooter.scss';

let SaveOrCancelFooter = React.createClass({
    propTypes: {
        /**
         * left footer actions
         */
        leftAlignedButtons: React.PropTypes.node,
        /**
         * center footer actions
         */
        centerAlignedButtons: React.PropTypes.node,
        /**
         * right footer icons
         */
        rightAlignedButtons: React.PropTypes.node,
    },


    render() {
        console.log('this.props.rightAlignedButtons: ', this.props.rightAlignedButtons);
        return (
            <div className="saveOrCancelFooter">
                <div className="leftActions">
                    {this.props.leftAlignedButtons}
                </div>

                {this.props.centerAlignedButtons}

                <div className="rightIcons">
                    {this.props.rightAlignedButtons}

                </div>
            </div>
        );
    }
});

export default SaveOrCancelFooter;
