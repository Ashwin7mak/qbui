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
        className: React.PropTypes.string,
        pullRight: React.PropTypes.bool,
        dropdownTooltip: React.PropTypes.bool,
        menuIcons: React.PropTypes.bool

    },
    getDefaultProps() {
        return {
            maxButtonsBeforeMenu: Number.MAX_VALUE,
            pullRight: true,
            menuIcons: false,
            dropdownTooltip: false
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
                    <Button key={action.msg}
                       tabIndex="0"
                       className={className}
                       onClick={action.onClick}>
                            <QBicon icon={action.icon}/>
                    </Button>
                </OverlayTrigger>);
    },
    /**
     * get dropdown containing remaining actions (after maxButtonsBeforeMenu index)
     */
    getActionsMenu() {

        const classes = this.props.menuIcons ? "menuIcons" : "";
        let dropdownTrigger;

        if (this.props.dropdownTooltip) {
            const tooltip = (<Tooltip id="more"><I18nMessage message="selection.more"/></Tooltip>);

            dropdownTrigger = <OverlayTrigger bsRole="toggle" key="more" placement="bottom" overlay={tooltip}>
                <Button tabIndex="0"  className={"dropdownToggle iconActionButton"}><QBicon icon="fries"/> </Button>
            </OverlayTrigger>;
        } else {
            dropdownTrigger = <Button bsRole="toggle" tabIndex="0"  className={"dropdownToggle iconActionButton"}><QBicon icon="fries"/> </Button>;
        }

        return (
            <Dropdown className={classes} id="nav-right-dropdown" pullRight={this.props.pullRight} onToggle={this.onToggleMenu} onClose={this.onCloseMenu}>

                {dropdownTrigger}
                <Dropdown.Menu onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit}>
                    {this.props.actions.map((action, index) => {
                        if (index >= this.props.maxButtonsBeforeMenu) {
                            return <MenuItem key={action.msg} href="#">
                                      {this.props.menuIcons && <QBicon className={action.className} icon={action.icon}/>}
                                       <I18nMessage message={action.msg} />
                                   </MenuItem>;
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
