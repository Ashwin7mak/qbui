import React from 'react';
import ReactBootstrap from 'react-bootstrap';
import {Panel}  from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import './qbpanel.scss';

/**
 *  # QBPanel
 *  Custom QuickBase Panel component that wraps the bootstrap component. You can pass content by wrapping it in a `<QBPanel></QBPanel>` tag.
 */
class QBPanel extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            open: this.props.isOpen
        };
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    toggleOpen() {
        this.setState({open: !this.state.open});
    }

    render() {
        let panelId = this.props.panelNum && ("panelId" + this.props.panelNum); // ID is optional

        return (
            <div className={"qbPanel " + (this.props.iconRight ? "iconRight" : "iconLeft") } id={panelId}>
                <div className="qbPanelHeader" >
                    <h3 className="qbPanelHeaderTitle">
                        <div className="qbPanelHeaderTitleText">{this.props.title}</div>
                        <QBicon icon="caret-right" onClick={this.toggleOpen} className={this.state.open ? "qbPanelHeaderIcon rotateDown" : "qbPanelHeaderIcon rotateUp"}/>
                    </h3>
                </div>
                <Panel collapsible expanded={this.state.open}>
                    <div className="qbPanelBody">
                        {this.props.children}
                    </div>
                </Panel>
            </div>
        );
    }
}

QBPanel.propTypes = {
    /**
     * the title to display in the Panel Header.
     */
    title: React.PropTypes.string,
    /**
    * boolean if we should start with the panel expanded or not
    */
    isOpen: React.PropTypes.bool,
    /**
     * creates a unique id for each panel object (helps with accessibility)
     */
    panelNum: React.PropTypes.number,
    /**
     * I guess the toggle icon is optional.
     */
    iconRight: React.PropTypes.bool
};
QBPanel.defaultProps = {
    title: "Untitled",
    isOpen: false,
    key: -1,
    iconRight: true
};

export default QBPanel;
