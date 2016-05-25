import React, {PropTypes} from 'react';
import Html from './html';

var Index = React.createClass({
    propTypes: {
        title: PropTypes.string,
        jsPath: PropTypes.string
    },
    render() {
        return (
            <Html {...this.props} >
                <div id="content" className="container">
                </div>

                <script src={this.props.hostBase + this.props.jsPath + this.props.bundleFileName}></script>
                <script type="text/javascript" async="" src={this.props.walkMePath + this.props.walkMeUser + this.props.walkMeFileName}></script>
            </Html>
        );
    }
});
module.exports = Index;
