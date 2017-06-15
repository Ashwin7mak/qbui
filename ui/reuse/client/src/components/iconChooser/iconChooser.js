import React from 'react';
import {PropTypes} from 'react';
import Icon from 'REUSE/components/icon/icon';
import IconUtils from 'REUSE/components/icon/iconUtils';

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
            <button tabIndex="0" className="showAllToggle" onClick={this.toggleAllIcons} type="button">
                <Icon className="showAllSelectedIcon" iconFont={this.props.font} icon={this.props.selectedIcon} tooltipTitle={IconUtils.getIconToolTipTitle(this.props.iconsByTag, this.props.selectedIcon)}/>
                <Icon icon="caret-down" className="toggleIcon"/>
            </button>);
    }

    /**
     * search input changed
     * @param e
     */
    filterChanged(e) {
        this.setState({filterText: e.target.value});
    }

    /**
     * get icons matching the current filter text
     */
    getFilteredIcons() {
        return this.props.icons.filter((icon) => IconUtils.filterMatches(this.props.iconsByTag, this.state.filterText.toLowerCase().trim(), icon));
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
     * rendering all the icons is actually fairly slow so do it only when necessary
     * @param nextProps
     * @param nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {

        return nextProps.isOpen !== this.props.isOpen ||
            nextProps.selectedIcon !== this.props.selectedIcon ||
            nextProps.isOpen !== this.props.isOpen ||
            nextState.filterText !== this.state.filterText;
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
                    <div className="iconSearch searchInputBox"><input type="text" value={this.state.filterText} placeholder={Locale.getMessage("iconChooser.searchPlaceholder")} onChange={this.filterChanged} cols="20"/><Icon icon="search" className="searchIcon"/></div>
                </div>

                <div className="allIcons">
                    {this.getFilteredIcons().map((icon, i) => <button alt={icon} className={"iconButton " + icon} tabIndex="0" key={i} onClick={() => this.selectIcon(icon)} type="button"><Icon iconFont={this.props.font} icon={icon} tooltipTitle={IconUtils.getIconToolTipTitle(this.props.iconsByTag, icon)}/></button>)}
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
