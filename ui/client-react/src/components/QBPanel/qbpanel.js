import React from 'react';
import ReactBootstrap from 'react-bootstrap';
import {Panel}  from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import './qbpanel.scss';

/*
    Custom QuickBase Panel component that has 4 properties.
        title: the title to display in the Panel Header
        isOpen: boolean if we should start with the panel expanded or not
        panelNum: creates a unique id for each panel object (helps with accessibility)
        children: the content displayed within the panel itself
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
        let icon = (this.props.iconRight ? "iconRight" : "iconLeft");
        let iconClass = (this.state.open ? "qbPanelHeaderIcon rotateDown " : "qbPanelHeaderIcon rotateUp ") + icon;
        let className = "qbPanel ";
        className += this.state.open ? "open " : "closed ";
        className += this.props.iconRight ? "iconRight " : "iconLeft ";
        className += this.props.className ? this.props.className : "";
        return (
            <div className={className} id={panelId}>
                <div className="qbPanelHeader" >
                    <h3 className="qbPanelHeaderTitle">
                        <div className="qbPanelHeaderTitleText">{this.props.title}</div>
                        <QBicon icon="caret-right" onClick={this.toggleOpen} className={iconClass}/>
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
    title: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    panelNum: React.PropTypes.number,
    iconRight: React.PropTypes.bool,
    className: React.PropTypes.string
};
QBPanel.defaultProps = {
    title: "Untitled",
    isOpen: false,
    key: -1,
    iconRight: true
};

export default QBPanel;
