import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
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
         * header content (breadcrumbs)
         */
        breadcrumbs: React.PropTypes.node,
        /**
         * main content of trowser
         */
        content: React.PropTypes.node.isRequired,
        /**
         * cancel trowser callback (ESC key pressed or X icon clicked)
         */
        onCancel: React.PropTypes.func,
        /**
         * save trowser callback (CMD/CTRL+S key pressed or save button clicked)
         */
        onSave: React.PropTypes.func
    },
    defaultProps: {
        position: "top"
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
                <KeyboardShortcuts id="trowser"
                                   shortcutBindingsPreventDefault={[
                                       {key: 'mod+s', callback: () => {this.props.onSave(); return false;}},
                                       {key: 'esc', callback: () => {this.props.onCancel(); return false;}}
                                   ]} />
                <div className={"trowserContent"}>
                    <div className={"trowserHeader"}>
                        <div className={"breadcrumbs h4"}>
                            {this.props.breadcrumbs}
                        </div>
                        <div className={"rightIcons"}>
                            <Button onClick={this.props.onCancel}><QBicon icon={"close"}/></Button>
                        </div>
                    </div>

                    <div className={"trowserChildren"}>
                        {this.props.content}
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

export default Trowser;
