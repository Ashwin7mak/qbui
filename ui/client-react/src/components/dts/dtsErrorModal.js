import React from 'react';
import QBModal from '../qbModal/qbModal';
import UrlUtils from '../../utils/urlUtils';
import Locale from '../../locales/locales';
import './dtsErrorModal.scss';

const DTSErrorModal = React.createClass({
    /**There will be no state
     * There will be no function to close modal
     * Everything will exist in it's parents
     * This is only for building/testing purposes right now
    */
    propTypes: {
        show: React.PropTypes.bool,
        selectedAppId: React.PropTypes.string,
        tid: React.PropTypes.string,
        link: React.PropTypes.string
    },
    render() {
        const title = Locale.getMessage('dtsErrorModal.dtsErrorTitle');
        const primaryButtonName = Locale.getMessage('dtsErrorModal.dtsErrorPrimaryButtonText');
        const errorMessage = <div className="dtsErrorModal">
                                <span className="dtsErrorBodyMessageOne">
                                    {Locale.getMessage('dtsErrorModal.dtsErrorBodyMessage')}
                                </span>
                                <span className="dtsErrorBodyMessageTwo">
                                    {Locale.getMessage('dtsErrorModal.dtsErrorSecondErrorBodyMessage')}
                                </span>
                                <span className="dtsErrorTID">
                                    {Locale.getMessage('dtsErrorModal.dtsErrorTID')}
                                    <p>{this.props.tid}</p>
                                </span>
                            </div>;

        return (
            <QBModal
                uniqueClassName={"dtsErrorModal"}
                show={this.props.show}
                size="large"
                primaryButtonName={primaryButtonName}
                title={title}
                link={this.props.link}
                type="dtsAppDeleted" >
                {errorMessage}
            </QBModal>
        );
    }
});

export default DTSErrorModal;
