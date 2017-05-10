import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import './qbpanel.scss';
import Collapse from 'react-bootstrap/lib/Collapse';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';

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
        className += this.props.wrapLabels ? "" : "noWrapLabels ";
        className += this.props.className ? this.props.className : "";

        return (
            <div className={className} id={panelId}>
                <div className="qbPanelHeader" onClick={this.props.collapsible && this.toggleOpen} >
                    <h3 className="qbPanelHeaderTitle">
                        <div className="qbPanelHeaderTitleText">{this.props.title}</div>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="expandToolTip">{this.state.open ? <I18nMessage message="nav.collapseSection"/> : <I18nMessage message="nav.expandSection"/>}</Tooltip>}>
                            <Button className="qbPanelHeaderButton" onClick={this.props.onCancel}><QBicon icon="caret-down" className={iconClass}/></Button>
                            </OverlayTrigger>
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
    collapsible: true,
    wrapLabels: true
};

export default QBPanel;
