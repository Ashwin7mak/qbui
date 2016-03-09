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
 *
 * example:
 *
 * if the actions prop is passed:
 * [
 *  {name: 'name-a', icon: 'icon-a'},
 *  {name: 'name-b', icon: 'icon-b'},
 *  {name: 'name-c', icon: 'icon-b'}
 * ];
 *
 * to render a dropdown containing name-a,name-b, and name-c we pass menuAfter={0}
 * to render 3 QBIcons without a dropdown menu we pass menuAfter={2} (or greater)
 * to render 1 icon with a dropdown containing name-b and name-c we pass menuAfter={1}
 */

let actions = [
    {name: 'a', icon: 'icon-a'},
    {name: 'b', icon: 'icon-b'},
    {name: 'ca', icon: 'icon-b'}
];
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
