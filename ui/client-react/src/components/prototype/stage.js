import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';


var Stage = React.createClass({
    render: function() {
        return (
            <div className="stage">
                <h1>Stage Title</h1>
                <div className="stageContent">
                    <p>This is some really cool stage content</p>
                </div>
                <div className="stageClose">
                    <Glyphicon glyph="menu-up" />
                </div>
            </div>
        );
    }
});

export default Stage;
