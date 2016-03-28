import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {MenuItem, Button, Input, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import './iconActions.scss';

/**
 * a set of icon actions, of which maxButtonsBeforeMenu are displayed
 * followed by a dropdown containing the remainder
 *
 * example:
 *
 * if the actions prop is passed:
 * [
 *  {msg: 'name-a', icon: 'icon-a'},
 *  {msg: 'name-b', icon: 'icon-b'},
 *  {msg: 'name-c', icon: 'icon-b'}
 * ];
 *
 * to render a dropdown containing localized name-a,name-b, and name-c we pass maxButtonsBeforeMenu={0}
 * to render 3 QBIcons without a dropdown menu we pass maxButtonsBeforeMenu={2} (or greater)
 * to render 1 icon with a dropdown containing name-b and name-c we pass maxButtonsBeforeMenu={1}
 */

let IconActions = React.createClass({

    // actions don't have any functionality yet...
    propTypes: {
        actions: React.PropTypes.arrayOf(React.PropTypes.shape({
            icon: React.PropTypes.string,
            msg: React.PropTypes.string,
            onClick: React.PropTypes.function,
            className: React.PropTypes.string
        })).isRequired,
        maxButtonsBeforeMenu: React.PropTypes.number, // show action in dropdown after this,
        className: React.PropTypes.string

    },
    getDefaultProps() {
        return {
            maxButtonsBeforeMenu: Number.MAX_VALUE
        };
    },
    /**
     * get an action button
     * @param action
     */
    getActionButton(action) {
        const tooltip = (<Tooltip id={action.msg}><I18nMessage message={action.msg}/></Tooltip>);
        let className = "iconActionButton ";

        if (action.className) {
            className += action.className;
        }

        return (<OverlayTrigger key={action.msg} placement="bottom" overlay={tooltip}>
                    <a key={action.msg}
                       className={className}
                       onClick={action.onClick}>
                            <QBicon icon={action.icon}/>
                    </a>
                </OverlayTrigger>);
    },
    /**
     * get dropdown containing remaining actions (after maxButtonsBeforeMenu index)
     */
    getActionsMenu() {
        const moreTooltip = (
            <Tooltip id="iconActions.more">
                <I18nMessage message={"iconActions.more"} />
            </Tooltip>);

        return (
            <Dropdown id="nav-right-dropdown" pullRight onToggle={this.onToggleMenu} onClose={this.onCloseMenu}>
                <OverlayTrigger bsRole="toggle" key={"iconActions.more"} placement="bottom" overlay={moreTooltip}>
                    <a className={"dropdownToggle iconActionButton"}><QBicon icon="fries"/> </a>
                </OverlayTrigger>

                <Dropdown.Menu onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit}>
                    {this.props.actions.map((action, index) => {
                        if (index >= this.props.maxButtonsBeforeMenu) {
                            return <MenuItem key={action.msg} href="#"><I18nMessage message={action.msg} /></MenuItem>;
                        }
                    })}
                </Dropdown.Menu>
            </Dropdown>);
    },
    render() {
        return (
            <div className={'iconActions ' + this.props.className}>
                {this.props.actions.map((action, index) => {
                    if (index < this.props.maxButtonsBeforeMenu) {
                        return this.getActionButton(action);
                    }
                })}
                {(this.props.actions.length > this.props.maxButtonsBeforeMenu) && this.getActionsMenu()}
            </div>
        );
    }
});

export default IconActions;
