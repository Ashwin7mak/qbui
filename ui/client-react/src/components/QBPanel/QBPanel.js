/**
 * Created by fbeyer on 10/29/15.
 */
import React from 'react';

import ReactBootstrap from 'react-bootstrap';
import {Glyphicon, Collapse}  from 'react-bootstrap';

import './QBPanel.scss';

class QBPanel extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
        this.handlePanelClick = this.handlePanelClick.bind(this);
    }

    initState(){
        let initialState = {
            showSection: false
        };
        return initialState;
    }

    handlePanelClick(){
        this.setState({ showSection: !this.state.showSection });
    }

    render () {
        return (
            <div className="card">
                <div className="cardHeader" onClick={this.handlePanelClick}>
                    <h3>{this.props.title}<small className="cardHeaderIcon">
                        <Glyphicon glyph="chevron-up" className={this.state.showSection ? "rotateDown" : "rotateUp"}/>
                    </small></h3>
                </div>
                <Collapse in={this.state.showSection}>
                    <div id="cardBody">
                        {this.props.children}
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default QBPanel;