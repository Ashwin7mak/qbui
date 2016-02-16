import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import './trowser.scss';

/**
 * a transaction browser (like a modal but slides up/down and width & height=100%)
 */
let Trowser = React.createClass({
    propTypes: {
        visible: React.PropTypes.bool,
        position: React.PropTypes.string // top or bottom
    },
    defaultProps: {
        position: "top"
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
                    <div className={"trowserHeader"}>
                        <div className={"breadCrumbs"}>
                            {this.props.breadcrumbs}
                        </div>
                        <div className={"rightIcons"}>
                            <Button><QBicon icon={"help"}/></Button>
                            <Button onClick={this.props.onCancel}><QBicon icon={"close"}/></Button>
                        </div>
                    </div>
                    <div className={"trowserChildren"}>
                        {this.props.children}
                    </div>
                    <div className={"trowserFooter"}>
                        <div className={"rightIcons"}>
                            <Button bsStyle="primary" onClick={this.props.onDone}>Done</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Trowser;
