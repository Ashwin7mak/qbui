import React from 'react';
import {PropTypes} from 'react';

import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';

// IMPORTS FROM CLIENT REACT
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// IMPORTS FROM CLIENT REACT

import './iconChooser.scss';

/**
 * # Icon Chooser
 * A pseudo-menu containing a grid of selectable icons
 * ## Usage
 * ```
 *   <IconChooser ...props/>
 */
class IconChooser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filterText: ''
        };
        this.toggleAllIcons = this.toggleAllIcons.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
    }

    toggleAllIcons() {

        if (this.props.isOpen) {

            this.props.onClose();
        } else {
            this.setState({filterText: ''});
            this.props.onOpen();
        }
    }

    renderIconToggle() {
        return (
            <div className="showAllToggle" onClick={this.toggleAllIcons}>
                <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.selectedIcon}/>
                <Icon icon="caret-filled-down" className="toggleIcon"/>
            </div>);
    }

    filterChanged(e) {
        this.setState({filterText: e.target.value});
    }

    filterMatches(text, icon) {

        if (text === '') {
            return true;
        }
        const iconName = icon.toLowerCase();

        if (iconName.indexOf(text) !== -1) {
            return true;
        }

        const matchedTags = this.props.iconsByTag.filter((tagToIcons) => tagToIcons.tag.toLowerCase().indexOf(text) !== -1);

        if (!matchedTags) {
            return false;
        }

        return matchedTags.find((taggedIcons) => taggedIcons.icons.find((taggedIcon) => taggedIcon.toLowerCase() === iconName));
    }

    getFilteredIcons() {
        return this.props.icons.filter((icon) => this.filterMatches(this.state.filterText.toLowerCase().trim(), icon));
    }

    selectIcon(icon) {
        this.toggleAllIcons();
        this.props.onSelect(icon);
    }


    render() {
        let classes = ['iconChooser', this.props.isOpen ? 'open' : 'closed'];
        if (this.props.classes) {
            classes = [...classes, this.props.classes];
        }

        return (
            <div className={classes.join(' ')}>
                <div className="topRow">
                    {this.renderIconToggle()}
                    <div className="iconSearch"><input type="text" value={this.state.filterText} placeholder="Search table icons..." onChange={this.filterChanged} cols="20"/></div>
                </div>

                <div className="allIcons">
                    {this.getFilteredIcons().map((icon, i) => <Icon key={i} onClick={() => this.selectIcon(icon)} iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={icon}/>)}
                </div>
            </div>);
    }
}


IconChooser.propTypes = {
    selectedIcon: PropTypes.string
};

IconChooser.defaultProps = {
    selectedIcon: 'tasks'
};

export default IconChooser;
