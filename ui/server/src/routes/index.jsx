import React, {PropTypes} from 'react';
import Html from './html';
import LoadingScreen from './loadingScreen';

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
                    <LoadingScreen/>
                </div>
                <script async={true} src={this.props.hostBase +
                             this.props.jsPath + this.props.bundleFileName}></script>
                <script type="text/javascript" async={true} src={this.props.walkMeJS}></script>
            </Html>
        );
    }
});
module.exports = Index;
