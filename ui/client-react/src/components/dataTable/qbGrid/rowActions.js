/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/
import React, {PropTypes, Component} from 'react';
import RowActionsReuse from '../../../../../reuse/client/src/components/rowActions/rowActions';
import QbIconActions from './qbIconActions';
import Locale from '../../../../../reuse/client/src/locales/locale';

class RowActions extends Component {

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
        {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.props.onClickEditRowIcon},
        {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
        {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
        {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
        {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.props.onClickDeleteRowIcon}
        ];
        return <RowActionsReuse iconActionsNode={<QbIconActions onClickEditRowIcon={this.onClickEditRowIcon}
                                                                onClickDeleteRowIcon={this.onClickDeleteRowIcon}
                                                                dropdownTooltip={true}
                                                                className="recordActions"
                                                                pullRight={false}
                                                                menuIcons
                                                                actions={actions}
                                                                maxButtonsBeforeMenu={1}
                                                />} {...this.props}
                />;
    }
}



export default RowActions;
