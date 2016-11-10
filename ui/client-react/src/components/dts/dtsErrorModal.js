import React from 'react';
import QBModal from '../qbModal/qbModal';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import './dtsErrorModal.scss';

const DTSErrorModal = React.createClass({
    ///There will be no state
    //There will be no function to close modal
    //Everything will exist in it's parents
    //This is only for building/testing purposes right now
    propTypes: {
        show: React.PropTypes.bool,
        selectedAppId: React.PropTypes.string,
        tid: React.PropTypes.string
    },
    render() {
        const title = <I18nMessage message={'dtsErrorModal.dtsErrorTitle'} />;
        const errorMessage = <div className="dtsErrorModal">
                                <span className="dtsErrorBodyMessageOne">
                                    <I18nMessage message={'dtsErrorModal.dtsErrorBodyMessage'} />
                                </span>
                                <span className="dtsErrorBodyMessageTwo">
                                    <I18nMessage message={'dtsErrorModal.dtsErrorSecondErrorBodyMessage'} />
                                </span>
                                <span className="dtsErrorTID">
                                    <I18nMessage message={'dtsErrorModal.dtsErrorTID'} />
                                    <p>{this.props.tid}</p>
                                </span>
                            </div>;
        const primaryButtonName = <I18nMessage message={'dtsErrorModal.dtsErrorPrimaryButtonText'} />;
        return (
            <QBModal
                uniqueClassName={"dtsErrorModal"}
                show={this.props.show}
                size="large"
                primaryButtonName={primaryButtonName}
                title={title}
                link={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}
                type="dtsAppDeleted" >
                {errorMessage}
            </QBModal>
        );
    }
});

export default DTSErrorModal;
