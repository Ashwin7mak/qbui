import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {MenuItem, Button, Input, Dropdown} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import './pageActions.scss';

/**
 * a set of page actions, of menuAfter are displayed
 * followed by a dropdown containing the remainder
 */
let PageActions = React.createClass({

    // actions don't have any functionality yet...
    propTypes: {
        actions: React.PropTypes.arrayOf(React.PropTypes.shape({
            icon: React.PropTypes.string,
            name: React.PropTypes.string
        })).isRequired,
        menuAfter: React.PropTypes.number // show action in dropdown after this
    },
    getDefaultProps() {
        return {
            menuAfter: 0
        };
    },
    /**
     * get an action button
     * @param action
     */
    getActionButton(action) {
        return (<a key={action.name} className="pageActionButton"><QBicon icon={action.icon}/></a>);
    },
    /**
     * get dropdown containing remaining actions (after menuAfter index)
     */
    getActionsMenu() {
        return (
            <Dropdown id="nav-right-dropdown" pullRight onToggle={this.onToggleMenu} onClose={this.onCloseMenu}>
                <a bsRole="toggle" className={"dropdownToggle pageActionButton"}><QBicon icon="fries"/> </a>

                <Dropdown.Menu onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit}>
                    {this.props.actions.map((action, index) => {
                        if (index >= this.props.menuAfter) {
                            return <MenuItem key={action.name} href="#">{action.name}</MenuItem>;
                        }
                    })}
                </Dropdown.Menu>
            </Dropdown>);
    },
    render() {
        return (
            <div className={'pageActions'}>
                {this.props.actions.map((action, index) => {
                    if (index < this.props.menuAfter) {
                        return this.getActionButton(action);
                    }
                })}
                {(this.props.actions.length > this.props.menuAfter) && this.getActionsMenu()}
            </div>
        );
    }
});

export default PageActions;
