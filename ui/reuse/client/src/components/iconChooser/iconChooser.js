import React from 'react';
import {PropTypes} from 'react';

import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';

// IMPORTS FROM CLIENT REACT
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// IMPORTS FROM CLIENT REACT

import './iconChooser.scss';

/**
 * # Icon Chooser
 * A pseudo menu containing a grid of selectable icons
 * ## Usage
 * ```
 *   <IconChooser ...props/>
 */
class IconChooser extends React.Component {

    constructor(props) {
        super(props);

        this.toggleAllIcons = this.toggleAllIcons.bind(this);
    }

    toggleAllIcons() {

        if (this.props.isOpen) {
            this.props.onClose();
        } else {
            this.props.onOpen();
        }
    }

    render() {
        let classes = ['iconChooser', this.props.isOpen ? 'open' : 'closed'];
        if (this.props.classes) {
            classes = [...classes, this.props.classes];
        }

        return (
            <div className={classes.join(' ')}>
                <div className="topRow">
                    <div className="showAllToggle" onClick={this.props.xxx}>click</div><div><input type="text" cols="20"/></div>
                </div>
                <div className="allIcons">
                    {this.props.icons.map((icon) => <Icon key={icon} iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={icon}/>)}
                </div>
            </div>);
    }
}

export default IconChooser;
