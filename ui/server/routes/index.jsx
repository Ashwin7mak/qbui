import React, {PropTypes} from 'react';
import Html from './html';

var Index = React.createClass({
    propTypes: {
        title         : PropTypes.string,
        hostBase      : PropTypes.string,
        bundleFileName: PropTypes.string,
        jsPath        : PropTypes.string,
        isClientPerfTrackingEnabled: PropTypes.bool
    },
    render() {
        return (
            <Html {...this.props}>
                <div id="content">
                </div>
                <script src={this.props.hostBase +
                             this.props.jsPath + this.props.bundleFileName}></script>
                <script type="text/javascript" async="" src={this.props.walkMeJS}></script>
            </Html>
        );
    }
});
module.exports = Index;
