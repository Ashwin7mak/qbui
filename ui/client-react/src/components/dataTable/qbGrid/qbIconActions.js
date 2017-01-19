import React, {PropTypes} from 'react';
import IconActions from '../../actions/iconActions';
import Locale from '../../../locales/locales';

/**
 * A wrapper for IconActions so that display specific to this component can be abstracted from RowActions.
 * @type {__React.ClassicComponentClass<P>}
 */
const QbIconActions = React.createClass({
    propTypes: {
        onClickEditRowIcon: PropTypes.func,
        onClickDeleteRowIcon: PropTypes.func
    },

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.props.onClickEditRowIcon},
            {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.props.onClickDeleteRowIcon}
        ];

        return <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />;
    }
});

export default QbIconActions;
