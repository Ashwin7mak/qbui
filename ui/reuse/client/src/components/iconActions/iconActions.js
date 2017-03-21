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

        this.renderActionButton = this.renderActionButton.bind(this);
        this.renderDropDownTrigger = this.renderDropDownTrigger.bind(this);
        this.renderActionsMenu = this.renderActionsMenu.bind(this);
        this.onDropdownToggle = this.onDropdownToggle.bind(this);
    }

    getActionKey(action) {
        return action.key || _.uniqueId('actionButton_');
    }

    /**
     * Render an action button
     * @param action
     */
    renderActionButton(action) {
        let classNames = ['iconActionButton'];
        if (action.disabled) {
            classNames.push('disabled');
        }
        if (action.className) {
            classNames.push(action.className);
        }

        return (
            <Button
                key={this.getActionKey(action)}
                tabIndex="0"
                className={classNames.join(' ')}
                onClick={action.onClick}
            >
                <Tooltip i18nMessageKey={action.i18nMessageKey} plainMessage={action.plainMessage} placement="bottom">
                    <Icon icon={action.icon}/>
                </Tooltip>
            </Button>
        );
    }

    renderDropDownTrigger() {
        const dropdownTrigger = <button bsRole="toggle" tabIndex="0"  className="btn dropdownToggle iconActionButton"><Icon icon="fries"/> </button>;

        if (this.props.dropdownTooltip && !this.state.dropdownOpen) {
            return (
                <Tooltip bsRole="toggle" tipId="more" i18nMessageKey="selection.more" key="more" location="bottom">
                    {dropdownTrigger}
                </Tooltip>
            );
        }

        return dropdownTrigger;
    }

    renderActionInMenu(action) {
        return (
            <MenuItem className="menuActionButton" key={this.getActionKey(action)} href="#" onSelect={action.onClick} disabled={action.disabled}>
                {
                    this.props.menuIcons &&
                    <Icon className={action.disabled ? "disabled " + action.className : action.className} icon={action.icon}/>
                }

                {action.i18nMessageKey ? <I18nMessage message={action.i18nMessageKey}  /> : action.plainMessage}
            </MenuItem>
        );
    }

    /**
     * Render dropdown containing remaining actions (after maxButtonsBeforeMenu index)
     */
    renderActionsMenu() {
        const {actions, pullRight, maxButtonsBeforeMenu} = this.props;
        const classes = this.props.menuIcons ? 'menuIcons' : '';

        return (
            <Dropdown className={`iconActionsDropDownMenu ${classes}`} id="nav-right-dropdown" pullRight={pullRight} onToggle={this.onDropdownToggle} rootClose>
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
                {actions.map((action, index) => (index < maxButtonsBeforeMenu ? this.renderActionButton(action) : null))}
                {(actions.length > maxButtonsBeforeMenu) && this.renderActionsMenu()}
            </div>
        );
    }
}

IconActions.propTypes = {
    /**
     * An array of actions to display */
    actions: PropTypes.arrayOf(React.PropTypes.shape({
        /**
         * The key to use to identify the action in the array of components and specify the action in the callback */
        key: PropTypes.string,

        /**
         * The icon. This is eventually passed to Icon so checkout that component for more info. */
        icon: PropTypes.string,

        /**
         * An I18nMessage string key */
        i18nMessageKey: PropTypes.string,

        /**
         * A non-localized string to use. Will be overwritten by i18nMessagekey if that prop is also passed in. Only use this prop if the string has already been localized. */
        plainMessage: PropTypes.string,

        /**
         * A callback that occurs when this action is clicked. It receives an onClick or onSelect event as an argument. */
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
    maxButtonsBeforeMenu: PropTypes.number,

    /**
     * An optional class to add to the main component */
    className: PropTypes.string,

    /**
     * Set to true if the iconActions are positioned on the right side of the UI.
     * Aligns the menu with the right side of the dropdown menu. I.e, pushes the menu to the left so it doesn't appear off-screen for menus on the right edge of the screen. */
    pullRight: PropTypes.bool,

    /**
     * An optional tooltip to display when hovering over the menu dropdown button */
    dropdownTooltip: PropTypes.bool,

    /**
     * Indicate whether the menu items should have icons */
    menuIcons: PropTypes.bool,

    /**
     * A callback that is fired when the dropdown menu is clicked. It is passed one argument that is a boolean indicating whether the menu is open */
    onDropdownToggle: PropTypes.func
};

IconActions.defaultProps = {
    maxButtonsBeforeMenu: Number.MAX_VALUE,
    pullRight: true,
    menuIcons: false,
    dropdownTooltip: false,
    className: ''
};

export default IconActions;
