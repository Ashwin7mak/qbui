import React from 'react';
import {PropTypes, Component} from 'react';
import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';
import IconUtils from 'REUSE/components/icon/iconUtils';
import {I18nMessage} from "../../utils/i18nMessage";

// IMPORTS FROM CLIENT REACT
import Locale from 'APP/locales/locales';
// IMPORTS FROM CLIENT REACT

import './iconChooser.scss';

/**
 * # Icon Chooser
 * A component that can expand to display a searchable grid of icons
 * ## Usage
 * ```
 *   <IconChooser ...props/>
 */
class IconChooser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterText: '' // search text
        };
    }

    /**
     * expand/collapse icon grid
     */
    toggleAllIcons = () => {
        if (this.props.isOpen) {
            this.props.onClose();
        } else {
            // reset search text when icon chooser is expanded
            this.setState({filterText: ''});
            this.props.onOpen();
        }
    }

    /**
     * render the expand/collapse toggle
     * @returns {XML}
     */
    renderIconToggle = () => {
        return (
            <button tabIndex="0" className="showAllToggle" onClick={this.toggleAllIcons} type="button">
                <Icon className="showAllSelectedIcon" iconFont={this.props.font} icon={this.props.selectedIcon} tooltipTitle={IconUtils.getIconToolTipTitle(this.props.listOfIconsByTagNames, this.props.selectedIcon)}/>
                <Icon icon="caret-down" className="toggleIcon"/>
            </button>);
    };

    /**
     * search input changed
     * @param e
     */
    filterChanged = (e) => {
        this.setState({filterText: e.target.value});
    };

    /**
     * get icons matching the current filter text
     */
    getFilteredIcons = () => {
        return this.props.listOfIconsByNames.filter((icon) => IconUtils.filterMatches(this.props.listOfIconsByTagNames, this.state.filterText.toLowerCase().trim(), icon));
    };

    /**
     * rendering all the icons is actually fairly slow so do it only when necessary
     * @param nextProps
     * @param nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {

        return nextProps.isOpen !== this.props.isOpen ||
            nextProps.selectedIcon !== this.props.selectedIcon ||
            nextProps.name !== this.props.name ||
            nextState.filterText !== this.state.filterText;
    }

    /**
     * get a table icon with a given name
     * @param name
     * @returns {XML}
     */
    getIcon = (name) => {
        return <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={name} tooltipTitle={IconUtils.getIconToolTipTitle(this.props.listOfIconsByTagNames, name)}/>;
    };

    /**
     * display suggested icons in a list
     * @returns {XML}
     */
    getSuggestedIcons = () => {
        const name = _.get(this.props, 'name', '').toLowerCase().trim();

        if (name === '') {
            return <div className="noSuggestedIcons iconList"><I18nMessage message={this.props.typeForSuggestionsText}/></div>;
        }

        let suggestedIcons = this.props.listOfIconsByNames.filter((icon) => IconUtils.filterMatches(this.props.listOfIconsByTagNames, name, icon)).slice(0, 8);

        if (suggestedIcons.length === 0) {
            return <div className="noSuggestedIcons iconList"><I18nMessage message={this.props.noSuggestedIconsText}/></div>;
        }

        return (
            <div className="iconList">
                {suggestedIcons.map((iconName, i) => (
                    <button key={i} onClick={() => this.selectIconDoNotToggle(iconName)} type="button">
                        {this.getIcon(iconName)}
                    </button>))}
            </div>);
    };

    /**
     * icon selected callback
     * @param icon
     */
    selectIcon = (icon) => {
        this.toggleAllIcons(); // collapse the icon chooser
        this.props.setIconChoice(icon);
    };

    /**
     * selectIconDoNotToggle selected callback
     * allows a user to select an icon from the list of suggested icon without toggling the icon menu open
     * @param icon
     */
    selectIconDoNotToggle = (icon) => {
        this.props.setIconChoice(icon);
    };

    /**
     * render icon chooser
     * @returns {XML}
     */
    render() {
        let classes = ['iconChooser', this.props.isOpen ? 'open' : 'closed'];
        if (this.props.classes) {
            classes = [...classes, this.props.classes];
        }

        return (
            <div className={`${this.props.className} dialogField iconSelection`}>
                <div className={classes.join(' ')}>
                    <div className="topRow">
                        {this.renderIconToggle()}
                        <div className="iconSearch searchInputBox"><input type="text" value={this.state.filterText} placeholder={Locale.getMessage(this.props.placeHolder)} onChange={this.filterChanged} cols="20"/><Icon icon="search" className="searchIcon"/></div>
                    </div>

                    <div className="allIcons">
                        {this.getFilteredIcons().map((icon, i) => <button alt={icon} className={"iconButton " + icon} tabIndex="0" key={i} onClick={() => this.selectIcon(icon)} type="button"><Icon iconFont={this.props.font} icon={icon} tooltipTitle={IconUtils.getIconToolTipTitle(this.props.listOfIconsByTagNames, icon)}/></button>)}
                    </div>
                </div>
                <div className="dialogFieldTitle suggestedIcons">
                    <div className="fieldTitle"><I18nMessage message="iconChooser.suggestedIconsHeading"/></div>
                    {this.getSuggestedIcons()}
                </div>
            </div>);
    }
}

IconChooser.propTypes = {
    /**
     * a className makes it easier for a QE to locate dom elements on the page
     */
    className: PropTypes.string.isRequired,
    /**
     * additional classes
     */
    classes: PropTypes.string,
    /**
     * sets text for typeForSuggestionsText
     */
    typeForSuggestionsText: PropTypes.string,
    /**
     * sets text for no suggestions
     */
    noSuggestedIconsText: PropTypes.string,
    /**
     * sets the icon
     */
    setIconChoice: PropTypes.func,
    /**
     * an array of icons a user can choose from
     */
    listOfIconsByNames: PropTypes.array.isRequired,
    /**
     * current icon name
     */
    selectedIcon: PropTypes.string.isRequired,
    /**
     * should the chooser be expanded to include icon grid and search box
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * expand chooser callback
     */
    onOpen: PropTypes.func.isRequired,
    /**
     * close chooser callback
     */
    onClose: PropTypes.func.isRequired,
    /**
     * icon font to use
     */
    font: PropTypes.string.isRequired,
    /**
     * icon categorization metadata (if tag includes search text, show icons from icons array)
     */
    listOfIconsByTagNames: PropTypes.arrayOf(PropTypes.shape({
        tag: React.PropTypes.string,
        icons: PropTypes.arrayOf(PropTypes.string)
    }))
};

IconChooser.defaultProps = {
    listOfIconsByTagNames: []
};

export default IconChooser;
