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
                    {/*The content in here will be replaced as soon as React loads*/}
                    <LoadingScreen/>
                </div>
                <script async={true} src={this.props.hostBase +
                             this.props.jsPath + this.props.bundleFileName}></script>
            </Html>
        );
    }
});
module.exports = Index;
