import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import './trowser.scss';

/**
 * a transaction browser (like a modal but slides up/down and width=100%)
 */
let Trowser = React.createClass({
    propTypes: {
        visible: React.PropTypes.bool,
        position: React.PropTypes.string // top or bottom
    },
    render() {
        let trowserClasses = "trowser " + this.props.position;
        if (this.props.visible) {
            trowserClasses += " visible";
        }
        return (
            <div className={trowserClasses} >
                <div className={"trowserBackground"}/>
                <div className={"trowserContent"}>
                    {this.props.children}

                    <div style={{height: "40px"}}>
                        <Button bsStyle="success" onClick={this.props.onHide}>Done</Button>
                    </div>
                </div>
            </div>
        );
    }
});

export default Trowser;
