import React, {Component, PropTypes} from 'react';
import Html from './html';
import LoadingScreen from './loadingScreen';

class Index extends Component {

    render() {
        return (
            <Html {...this.props}>
                <div id="content">
                    {/*The content in here will be replaced as soon as React in client-side bundle loads*/}
                    <LoadingScreen/>
                </div>

                <script src={this.props.hostBase + this.props.jsPath + this.props.vendorFileName}></script>
                <script async={true} src={this.props.hostBase +
                             this.props.jsPath + this.props.bundleFileName}></script>

                <script type="text/javascript" async src={this.props.wistiaJs1}></script>
                <script type="text/javascript" async src={this.props.wistiaJs2}></script>
            </Html>
        );
    }
}

Index.propTypes = {
    title : PropTypes.string,
    hostBase : PropTypes.string,
    bundleFileName : PropTypes.string,
    vendorFileName : PropTypes.string,
    jsPath : PropTypes.string,
    isClientPerfTrackingEnabled : PropTypes.bool
};

module.exports = Index;
