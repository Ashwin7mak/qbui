/**
 * Created by fbeyer on 10/29/15.
 */
import React from 'react';

import ReactBootstrap from 'react-bootstrap';
import {Panel}  from 'react-bootstrap';
import Hicon from '../harmonyIcon/harmonyIcon';

import './qbpanel.scss';

class QBPanel extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            open: this.props.isOpen
        };
    }

    render() {
        var panelId = "panelId" + this.props.key;
        return (
            <div className={"qbPanel"}>
                <div className="qbPanelHeader" onClick={ ()=> this.setState({open: !this.state.open})}>
                    <h3 id={panelId}>{this.props.title}<small className="qbPanelHeaderIcon">
                        <Hicon icon="chevron-up" className={this.state.open ? "rotateDown" : "rotateUp"}/>
                    </small></h3>
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

QBPanel.propTypes = {title: React.PropTypes.string, isOpen: React.PropTypes.bool, key: React.PropTypes.number};
QBPanel.defaultProps = {title: "Untitled", isOpen: false, key: -1};

export default QBPanel;
