import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import './trowser.scss';

/**
 * Transaction browser (like a modal but slides up/down and width & height=100%)
 */
let Trowser = React.createClass({
    propTypes: {
        /**
         * should trowser be visible
         */
        visible: React.PropTypes.bool.isRequired,
        /**
         * position ("top" or "bottom")
         */
        position: React.PropTypes.string, // top or bottom
        /**
         * left footer actions
         */
        leftActions: React.PropTypes.node,
        /**
         * center footer actions
         */
        centerActions: React.PropTypes.node,
        /**
         * header content (breadcrumbs)
         */
        breadcrumbs: React.PropTypes.node,
        /**
         * right footer icons
         */
        rightIcons: React.PropTypes.node,
        /**
         * main content of trowser
         */
        content: React.PropTypes.node.isRequired,
        /**
         * cancel trowser callback (ESC key pressed or X icon clicked)
         */
        onCancel: React.PropTypes.func,
    },
    defaultProps: {
        position: "top"
    },

    handleKey(e) {
        // close trowser when Esc is pressed
        if (e.keyCode === 27) {
            this.props.onCancel();
        }
    },
    componentWillMount() {
        window.addEventListener("keydown", this.handleKey, false);
    },

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey, false);
    },
    /**
     *
     * render trowser in front of a trowserBackground element (visible when browser is very wide)
     * (clicking on visible background closes trowser)
     */
    render() {
        let trowserClasses = "trowser " + this.props.position;
        if (this.props.visible) {
            trowserClasses += " visible";
        }
        if (this.props.className) {
            trowserClasses += " " + this.props.className;
        }
        return (
            <div className={trowserClasses} >
                <div className={"trowserBackground"} onClick={this.props.onCancel}/>
                <div className={"trowserContent"}>
                    <div className={"trowserHeader"}>
                        <div className={"breadcrumbs"}>
                            {this.props.breadcrumbs}
                        </div>
                        <div className={"rightIcons"}>
                            <Button><QBicon icon={"help"}/></Button>
                            <Button onClick={this.props.onCancel}><QBicon icon={"close"}/></Button>
                        </div>
                    </div>

                    <div className={"trowserChildren"}>
                        {this.props.content}
                    </div>

                    <div className={"trowserFooter"}>
                        <div className={"leftActions"}>
                            {this.props.leftActions}
                        </div>

                        {this.props.centerActions}

                        <div className={"rightIcons"}>
                            {this.props.rightIcons}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Trowser;
