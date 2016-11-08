import React from 'react';
import QBModal from '../qbModal/qbModal';
import UrlUtils from '../../utils/urlUtils';

const DTSErrorModal = React.createClass({
    ///There will be no state
    //There will be no function to close modal
    //Everything will exist in it's parents
    //This is only for building/testing purposes right now
    propTypes: {
        show: React.PropTypes.bool,
        selectedAppId: React.PropTypes.string
    },
    render() {
        const title = "Sorry to interrupt your work";
        const errorMessage = <p>
            Mercury can’t continue running your app today, but will resume tomorrow.
            Your app is still available in QuickBase Classic.
            <br/> <br/>
            Transaction ID: {this.props.tid}</p>;
        const primaryButtonName = "Open my app in Classic";
        return (
            <QBModal
                show={this.props.show}
                size="large"
                primaryButtonName={primaryButtonName}
                title={title}
                bodyMessage={errorMessage}
                link={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}
                type="dtsAppDeleted" />
        );
    }
});

export default DTSErrorModal;
