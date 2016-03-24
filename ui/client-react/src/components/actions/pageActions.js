import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {MenuItem, Button, Input, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
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
            msg: React.PropTypes.string
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
        const tooltip = (<Tooltip id={action.msg}><I18nMessage message={action.msg} /></Tooltip>);
        return (<OverlayTrigger key={action.msg} placement="bottom" overlay={tooltip}>
                    <a key={action.msg} className="pageActionButton"><QBicon icon={action.icon}/></a>
                </OverlayTrigger>);
    },
    /**
     * get dropdown containing remaining actions (after menuAfter index)
     */
    getActionsMenu() {
        const moreTooltip = (
            <Tooltip id="pageActions.more">
                <I18nMessage message={"pageActions.more"} />
            </Tooltip>);

        return (
            <Dropdown id="nav-right-dropdown" pullRight onToggle={this.onToggleMenu} onClose={this.onCloseMenu}>
                <OverlayTrigger bsRole="toggle" key={"pageActions.more"} placement="bottom" overlay={moreTooltip}>
                    <a className={"dropdownToggle pageActionButton"}><QBicon icon="fries"/> </a>
                </OverlayTrigger>

                <Dropdown.Menu onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit}>
                    {this.props.actions.map((action, index) => {
                        if (index >= this.props.menuAfter) {
                            return <MenuItem key={action.msg} href="#"><I18nMessage message={action.msg} /></MenuItem>;
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
