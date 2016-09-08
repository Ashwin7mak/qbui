import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import './userFieldValueEditor.scss';

const UserFieldValueEditor = React.createClass({
    displayName: 'UserFieldValueEditor',

    getInitialState() {
        return {selected: this.props.value.userId}
    },

    selectUser(selected) {

        this.setState({selected});

        if (this.props.onChange) {
            const appUser = this.props.appUsers.find(appUser => appUser.userId === selected.value);

            if (appUser) {
                this.props.onChange(appUser.userId);
            }
        }
    },

    getSelectItems() {
        return this.props.appUsers ?
            this.props.appUsers.map(user => {
                return { value: user.userId, label: `${user.lastName}, ${user.firstName}`};
            }) : [];
    },

    render() {
        return (
            <Select
                className="cellEdit"
                tabIndex="0"
                value={this.state.selected}
                options={this.getSelectItems()}
                onChange={this.selectUser}
                onBlur={this.props.onBlur}
            />
        );
    }
});

export default UserFieldValueEditor
