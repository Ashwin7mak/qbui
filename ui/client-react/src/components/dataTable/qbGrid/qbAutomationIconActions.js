import React, {PropTypes} from 'react';
import IconActions from '../../actions/iconActions';
import Locale from '../../../locales/locales';

/**
 * A wrapper for IconActions for use with Automation Icons
 * @type {__React.ClassicComponentClass<P>}
 */
const QbAutomationIconActions = React.createClass({
    propTypes: {
        onClickEditRowIcon: PropTypes.func,
        onClickDeleteRowIcon: PropTypes.func,
        onClickTestRowIcon: PropTypes.func
    },

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.editAutomation'), rawMsg: true, className:'edit', icon:'edit', onClick: this.props.onClickEditRowIcon},
            {msg: Locale.getMessage('selection.deleteAutomation'), rawMsg: true, className:'delete', icon:'delete', onClick: this.props.onClickDeleteRowIcon, disabled:true},
            {msg: Locale.getMessage('selection.testAutomation'), rawMsg: true, className:'delete', icon:'meter', onClick: this.props.onClickTestRowIcon}
        ];
        return <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />;
    }
});

export default QbAutomationIconActions;

