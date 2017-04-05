import React from 'react';
import {PropTypes} from 'react';
import Icon from '../icon/icon';
import QBicon from '../icon/icon.js';

// IMPORTS FROM CLIENT REACT
import Locale from '../../../../../client-react/src/locales/locales';
// IMPORTS FROM CLIENT REACT

import './iconChooser.scss';

/**
 * # Icon Chooser
 * A component that can expand to display a searchable grid of icons
 * ## Usage
 * ```
 *   <IconChooser ...props/>
 */
class IconChooser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filterText: '' // search text
        };

        // bind event handlers to fix context
        this.toggleAllIcons = this.toggleAllIcons.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
    }

    /**
     * expand/collapse icon grid
     */
    toggleAllIcons() {

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
    renderIconToggle() {
        return (
            <div className="showAllToggle" onClick={this.toggleAllIcons}>
                <Icon iconFont={this.props.font} icon={this.props.selectedIcon}/>
                <Icon icon="caret-filled-down" className="toggleIcon"/>
            </div>);
    }

    /**
     * search input changed
     * @param e
     */
    filterChanged(e) {
        this.setState({filterText: e.target.value});
    }

    /**
     * does filter text match icon?
     * @param text lowercase filter text
     * @param icon icon name
     * @returns {boolean}
     */
    filterMatches(text, icon) {

        if (text === '') {
            // no filter, display all icons
            return true;
        }
        const iconName = icon.toLowerCase();

        // match agains icon name
        if (iconName.indexOf(text) !== -1) {
            return true;
        }

        // find all tags (sets of icons by name) containing the search text
        const matchedTags = this.props.iconsByTag.filter((tagToIcons) => tagToIcons.tag.toLowerCase().indexOf(text) !== -1);

        // filter matches if any tag matching the filter text contains the current icon
        return matchedTags.find((taggedIcons) => taggedIcons.icons.find((taggedIcon) => taggedIcon === icon));
    }

    /**
     * get icons matching the current filter text
     */
    getFilteredIcons() {
        return this.props.icons.filter((icon) => this.filterMatches(this.state.filterText.toLowerCase().trim(), icon));
    }

    /**
     * icon selected callback
     * @param icon
     */
    selectIcon(icon) {
        this.toggleAllIcons(); // collapse the icon chooser

        this.props.onSelect(icon);
    }

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
            <div className={classes.join(' ')}>
                <div className="topRow">
                    {this.renderIconToggle()}
                    <div className="iconSearch searchInputBox"><input type="text" value={this.state.filterText} placeholder={Locale.getMessage("iconChooser.searchPlaceholder")} onChange={this.filterChanged} cols="20"/><QBicon icon="search" className="searchIcon"/></div>
                </div>

                <div className="allIcons">
                    {this.getFilteredIcons().map((icon, i) => <Icon key={i} onClick={() => this.selectIcon(icon)} iconFont={this.props.font} icon={icon}/>)}
                </div>
            </div>);
    }
}

IconChooser.propTypes = {
    /**
     * additional classes
     */
    classes: PropTypes.string,
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
     * icon names to include
     */
    icons: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * icon selected callback
     */
    onSelect: PropTypes.func.isRequired,
    /**
     * icon categorization metadata (if tag includes search text, show icons from icons array)
     */
    iconsByTag: PropTypes.arrayOf(PropTypes.shape({
        tag: React.PropTypes.string,
        icons: PropTypes.arrayOf(PropTypes.string)
    }))
};

IconChooser.defaultProps = {
    iconsByTag: []
};

export default IconChooser;
