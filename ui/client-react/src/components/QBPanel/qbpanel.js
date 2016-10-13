import React from 'react';
import ReactBootstrap from 'react-bootstrap';
import {Panel}  from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import './qbpanel.scss';
import {Collapse} from 'react-bootstrap';

/**
 *  # QBPanel
 *  Custom QuickBase Panel component that wraps the bootstrap component. You can pass content by wrapping it in a `<QBPanel></QBPanel>` tag.
 *
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
        className += this.props.collapsible ? "" : "nonCollapsible ";
        className += this.props.iconRight ? "iconRight " : "iconLeft ";
        className += this.props.className ? this.props.className : "";

        return (
            <div className={className} id={panelId}>
                <div className="qbPanelHeader" onClick={this.props.collapsible && this.toggleOpen} >
                    <h3 className="qbPanelHeaderTitle">
                        <div className="qbPanelHeaderTitleText">{this.props.title}</div>
                        <QBicon icon="caret-right" className={iconClass}/>
                    </h3>
                </div>
                <Collapse in={this.state.open}>
                    <div className="qbPanelBody">
                        <div>
                            {this.props.children}
                        </div>
                    </div>
                </Collapse>
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
     * allow user to collapse content
     */
    collapsible: React.PropTypes.bool,
    /**
     * creates a unique id for each panel object (helps with accessibility)
     */
    panelNum: React.PropTypes.number,
    iconRight: React.PropTypes.bool,
    className: React.PropTypes.string
};
QBPanel.defaultProps = {
    title: "Untitled",
    isOpen: false,
    key: -1,
    iconRight: true,
    collapsible: true
};

export default QBPanel;
