import React, {PropTypes} from 'react';
export const SELECT_ROW_CHECKBOX = 'selectRowCheckbox';

/**
 * The actions that appear in the first column of the Table.
 */
const UserRowActions = React.createClass({
    propTypes: {
        rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        isSelected: PropTypes.bool,
        onClickDeleteRowIcon: PropTypes.func,
        onClickToggleSelectedRow: PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            checked: this.props.isSelected || false
        };
    },

    componentWillReceiveProps(props) {
        this.setState({checked:props.isSelected});
    },

    onClickToggleSelectedRow() {
        const {onClickToggleSelectedRow, rowId, roleId} = this.props;

        this.setState(({checked}) => (
            {
                checked: !checked,
            }
        ));
        onClickToggleSelectedRow(rowId, roleId);
    },

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
});

export default UserRowActions;
