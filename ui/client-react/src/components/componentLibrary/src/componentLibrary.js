import React from 'react';
import {Link} from 'react-router';
import {ButtonToolbar, Dropdown, Modal, OverlayTrigger, Popover, Tooltip, Button, FormGroup, HelpBlock, ControlLabel, FormControl, InputGroup, Col, Checkbox, Radio, Form} from 'react-bootstrap';

var ComponentLibraryWrapper = React.createClass({
    render() {
        return (
            <div className="componentLibrary">
                <div className="componentLibraryNavigation">
                    <div className="header">
                        <h3 className="title">QuickBase<br />Component Library
                        </h3>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/components/qbpanel">QBPanel</Link></li>
                            <li><Link to="/components/qbicon">QBIcon</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="componentLibraryPage">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

export default ComponentLibraryWrapper;
