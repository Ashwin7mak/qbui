/**
 * Created by fbeyer on 10/29/15.
 */
import React from 'react';

import ReactBootstrap from 'react-bootstrap';
import {Glyphicon, Panel}  from 'react-bootstrap';

import './qbpanel.scss';

class QBPanel extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            open: this.props.isOpen
        };
    }

    render() {
        return (
            <div>
                <div className="qbPanelHeader" onClick={ ()=> this.setState({ open: !this.state.open })}>
                    <h3 id="title">{this.props.title}<small className="qbPanelHeaderIcon">
                        <Glyphicon glyph="chevron-up" className={this.state.open ? "rotateDown" : "rotateUp"}/>
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

QBPanel.propTypes = { isOpen: React.PropTypes.bool };
QBPanel.defaultProps = { isOpen: false};

export default QBPanel;
