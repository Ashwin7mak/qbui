import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';

import Fluxxor from 'fluxxor';
import Stage from './stage';
import './prototype.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Prototype = React.createClass({

    render: function() {
        return (
            <div className="apps-container">
                <div className="topBar">
                  <div className="branding">
                    This is the top nav
                  </div>

                  <div className="globalActions">
                    <div className="history">
                      <Glyphicon glyph="calendar" />
                    </div>
                    <div className="add">
                      <Glyphicon glyph="plus" />
                    </div>
                    <div className="search">
                      <Glyphicon glyph="search" />
                    </div>
                  </div>

                  <div className="loginStuff">
                    Welcome, Ed Schmegly
                  </div>
                </div>

                <div className="wrapper">
                  <div className="leftNav">
                    This is the left nav
                  </div>

                  <div className="pageContent">
                    <Stage />
                  </div>
                </div>
            </div>
        );
    }
});

export default Prototype;
