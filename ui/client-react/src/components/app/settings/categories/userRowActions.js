import React, {PropTypes} from 'react';
export const SELECT_ROW_CHECKBOX = 'selectRowCheckbox';

/**
 * The actions that appear in the first column of the Table.
 */
class UserRowActions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {checked: this.props.isSelected || false};
        this.onClickToggleSelectedRow = this.onClickToggleSelectedRow.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({checked: props.isSelected});
    }

    onClickToggleSelectedRow() {
        const {onClickToggleSelectedRow, rowId, roleId} = this.props;

        this.setState({checked: !this.state.checked});
        onClickToggleSelectedRow(rowId, roleId);
    }

    render() {
        return (
            <div className="actionsCol">
                <input
                    className={SELECT_ROW_CHECKBOX}
                    type="checkbox"
                    checked={this.state.checked}
                    onChange={this.onClickToggleSelectedRow}
                />

            </div>
        );
    }
}

UserRowActions.propTypes = {
    rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isSelected: PropTypes.bool,
    onClickDeleteRowIcon: PropTypes.func,
    onClickToggleSelectedRow: PropTypes.func.isRequired
};

export default UserRowActions;
