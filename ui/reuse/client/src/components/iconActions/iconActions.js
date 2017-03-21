import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Button from 'react-bootstrap/lib/Button';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';

// IMPORT FROM CLIENT REACT
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// IMPORT FROM CLIENT REACT


import './iconActions.scss';

/**
 * A set of icon actions, of which maxButtonsBeforeMenu are displayed
 * followed by a dropdown containing the remainder.
 *
 * example:
 *
 * if the actions prop is passed:
 * [
 *  {i18nMessageKey: 'name-a', icon: 'icon-a'},
 *  {i18nMessageKey: 'name-b', icon: 'icon-b'},
 *  {i18nMessageKey: 'name-c', icon: 'icon-b'}
 * ];
 *
 * to render a dropdown containing localized name-a,name-b, and name-c we pass maxButtonsBeforeMenu={0}
 * to render 3 QBIcons without a dropdown menu we pass maxButtonsBeforeMenu={2} (or greater)
 * to render 1 icon with a dropdown containing name-b and name-c we pass maxButtonsBeforeMenu={1}
 */
class IconActions extends Component {
    constructor(props) {
        super(props);

        this.state = {dropdownOpen: false};

        this.getActionButton = this.getActionButton.bind(this);
        this.renderDropDownTrigger = this.renderDropDownTrigger.bind(this);
        this.getActionsMenu = this.getActionsMenu.bind(this);
        this.onDropdownToggle = this.onDropdownToggle.bind(this);
    }

    getActionKey(action) {
        return action.key || _.uniqueId('actionButton_');
    }

    /**
     * Render an action button
     * @param action
     */
    getActionButton(action) {
        let classNames = ['iconActionButton'];
        if (action.disabled) {
            classNames.push('disabled');
        }
        if (action.className) {
            classNames.push(action.className);
        }

        return (
            <Tooltip key={this.getActionKey(action)} i18nMessageKey={action.i18nMessageKey} plainMessage={action.plainMessage} placement="bottom" >
                <Button
                    key={action.i18nMessageKey}
                    tabIndex="0"
                    className={classNames.join(' ')}
                    onClick={action.onClick}
                >
                    <Icon icon={action.icon}/>
                </Button>
            </Tooltip>
        );
    }

    renderDropDownTrigger() {
        const dropdownTrigger = <button bsRole="toggle" tabIndex="0"  className="btn dropdownToggle iconActionButton"><Icon icon="fries"/> </button>;

        if (this.props.dropdownBsToolTip && !this.state.dropdownOpen) {
            // TODO: Might need to add bsRole=toggle
            return (
                <Tooltip tipId="more" i18nMessageKey="selection.more" key="more" location="bottom">
                    {dropdownTrigger}
                </Tooltip>
            );
        }

        return dropdownTrigger;
    }

    renderActionInMenu(action) {
        return (
            <MenuItem key={this.getActionKey(action)} href="#" onSelect={action.onClick} disabled={action.disabled} >
                {this.props.menuIcons &&
                <Icon className={action.disabled ? "disabled " + action.className : action.className}
                        icon={action.icon}/>}
                {action.rawMsg ? action.msg : <I18nMessage message={action.msg} />}
            </MenuItem>
        );
    }

    /**
     * Render dropdown containing remaining actions (after maxButtonsBeforeMenu index)
     */
    getActionsMenu() {
        const {actions, pullRight, maxButtonsBeforeMenu} = this.props;
        const classes = this.props.menuIcons ? 'menuIcons' : '';


        return (
            <Dropdown className={classes} id="nav-right-dropdown" pullRight={pullRight} onToggle={this.onDropdownToggle} rootClose>
                {this.renderDropDownTrigger()}

                <Dropdown.Menu >
                    {actions.map((action, index) => index >= maxButtonsBeforeMenu ? this.renderActionInMenu(action) : null)}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    /**
     * A callback when the pickle menu (dropdown toggle) is clicked
     * @param open
     */
    onDropdownToggle(open) {
        //This adds white space at the bottom when the row menu is open to avoid clipping row menu pop up.
        //It will remove the white space if the menu is close. The class is added in reportContent.js
        this.setState({dropdownOpen: open});

        if (this.props.onDropdownToggle) {
            this.props.onDropdownToggle(open)
        }
    }

    render() {
        const {actions, maxButtonsBeforeMenu, className} = this.props;
        return (
            <div className={'iconActions ' + className}>
                {actions.map((action, index) => (index < maxButtonsBeforeMenu ? this.getActionButton(action) : null))}
                {(actions.length > maxButtonsBeforeMenu) && this.getActionsMenu()}
            </div>
        );
    }
}

IconActions.propTypes = {
    /**
     * An array of actions to display */
    actions: PropTypes.arrayOf(React.PropTypes.shape({
        /**
         * The key to use to identify the action in the array of components. */
        key: PropTypes.string,

        /**
         * The icon. This is eventually passed to Icon so checkout that component for more info. */
        icon: PropTypes.string,

        /**
         * An I18nMessage string key */
        i18nMessageKey: PropTypes.string,

        /**
         * A non-localized string to use. Will be overwritten by i18nMessagekey if that prop is also passed in. Only use this prop if the string has already been localized. */
        plainMessage: PropTypes.bool,

        /**
         * A callback that occurs when this action is clicked */
        onClick: PropTypes.func,

        /**
         * An optional className to add to the action for custom styling or E2E testing targets */
        className: PropTypes.string,

        /**
         * Can optionally display the action as disabled */
        disabled: PropTypes.bool
    })).isRequired,

    /**
     * The number of actions to show before the rest are displayed in a dropdown menu. Set to 0 to display all actions in a dropdown menu. */
    maxButtonsBeforeMenu: React.PropTypes.number,

    /**
     * An optional class to add to the main component */
    className: React.PropTypes.string,

    /**
     * Set to true if the iconActions are positioned on the right side of the UI.
     * Aligns the menu with the right side of the dropdown menu. I.e, pushes the menu to the left so it doesn't appear off-screen for menus on the right edge of the screen. */
    pullRight: React.PropTypes.bool,

    /**
     * An optional tooltip to display when hovering over the menu dropdown button */
    dropdownTooltip: React.PropTypes.bool,

    /**
     * Indicate whether the menu items have icons so we can add some spacing to account for the icons */
    menuIcons: React.PropTypes.bool,

    /**
     * A callback that is fired when the dropdown menu is clicked. It is passed one argument that is a boolean indicating whether the menu is open */
    onDropdownToggle: React.PropTypes.func
};

IconActions.defaultProps = {
    maxButtonsBeforeMenu: Number.MAX_VALUE,
    pullRight: true,
    menuIcons: false,
    dropdownTooltip: false,
    className: ''
};

export default IconActions;
