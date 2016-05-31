import React from 'react';
import {ButtonToolbar, Dropdown, Modal, OverlayTrigger, Popover, Tooltip, Button, FormGroup, HelpBlock, ControlLabel, FormControl, InputGroup, Col, Checkbox, Radio, Form} from 'react-bootstrap';

var ComponentLibrary = React.createClass({
    render() {
        return (
            <form>
                <FormGroup controlId="formValidationWarning1" validationState="warning">
                  <ControlLabel>Input with warning</ControlLabel>
                  <FormControl type="text" />
                </FormGroup>
            </form>
        );
    }
});

export default ComponentLibrary;
