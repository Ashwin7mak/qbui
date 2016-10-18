import React from 'react';
import QbIcon from '../qbIcon/qbIcon';
import './qbModals.scss';
import {I18nMessage} from '../../utils/i18nMessage';
import Breakpoints from "../../utils/breakpoints";
import {Modal} from 'react-bootstrap';

const QBModals = React.createClass({
    propTypes: {
        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
    },
    render() {
        return <Modal></Modal>;
    }
});

export default QBModals;
