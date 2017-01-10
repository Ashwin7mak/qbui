import React, {PropTypes} from 'react';
import Locale from '../../../locales/locales';
import IconActions from '../../actions/iconActions';

/**
 * The actions that appear in the first column of the QbGrid.
 * @type {__React.ClassicComponentClass<P>}
 */
const RowViewActions = React.createClass({
    propTypes: {
        onClickEditRowIcon: PropTypes.func,
        onClickDeleteRowIcon: PropTypes.func,
        recordId: PropTypes.number,
    },

    onClickEditRowIcon() {
        if (this.props.onClickEditRowIcon) {
            return this.props.onClickEditRowIcon(this.props.recordId);
        }
    },

    onClickDeleteRowIcon() {
        if (this.props.onClickDeleteRowIcon) {
            this.props.onClickDeleteRowIcon(this.props.recordId);
        }
    },

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.onClickEditRowIcon},
            {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.onClickDeleteRowIcon}
        ];

        return <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />;
    }
});

export default RowViewActions;
