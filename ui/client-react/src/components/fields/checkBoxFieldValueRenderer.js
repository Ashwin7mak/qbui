import React, {PropTypes} from 'react';
import './checkbox.scss';

import {I18nMessage} from '../../utils/i18nMessage';

let defaultSymbolClasses = 'symbol qbIcon ';

/**
 * # CheckBoxFieldValueRenderer
 *
 * Renders boolean or yes/no type values.
 *
 */
const CheckBoxFieldValueRenderer = React.createClass({
    propTypes: {
        value: PropTypes.bool,
        label: PropTypes.string,
        checkedIconClass: PropTypes.string,
        uncheckedIconClass: PropTypes.string,
        displayGraphic: PropTypes.bool,
        hideUncheckedCheckbox: PropTypes.bool
    },

    getDefaultProps() {
        return {
            // If not specified, the checkbox should NOT be checked
            value: false,
            label: '',
            checkedIconClass: 'iconTableUISturdy-check',
            uncheckedIconClass: 'checkbox-unchecked',
            displayGraphic: true,
            hideUncheckedCheckbox: false
        };
    },

    renderDisplayValue() {
        return (this.props.displayGraphic ? this.renderGraphicDisplayValue() : this.renderTextDisplayValue());
    },

    renderTextDisplayValue() {
        let checkBoxText;
        if (this.props.value) {
            checkBoxText = <I18nMessage message="fields.checkbox.yes" />;
        } else {
            checkBoxText = <I18nMessage message="fields.checkbox.no" className="checkbox-text" />;
        }
        return <span className="text">{checkBoxText}</span>;
    },

    renderGraphicDisplayValue() {
        return (this.props.value ? this.renderGraphicCheckedSymbol() : this.renderGraphicUncheckedSymbol());
    },

    renderGraphicCheckedSymbol() {
        let classes = `${defaultSymbolClasses} checked ${this.props.checkedIconClass}`;
        return (<span className={classes}></span>);
    },

    renderGraphicUncheckedSymbol() {
        if (!this.props.hideUncheckedCheckbox) {
            return (<span className={this.props.uncheckedIconClass}></span>);
        }
    },

    hasLabel() {
        let label = this.props.label;
        return label && label.length;
    },

    renderLabel() {
        if (this.hasLabel()) {
            return (<label className="label">{this.props.label}</label>);
        } else {
            return null;
        }
    },

    setGeneralClasses() {
        let classes = "checkbox renderer";
        classes += (this.hasLabel() ? ' hasLabel' : '');
        return classes;
    },

    render() {
        return (
            <div className={this.setGeneralClasses()}>
                {this.renderDisplayValue()}
                {this.renderLabel()}
            </div>
        );
    }
});

export default CheckBoxFieldValueRenderer;
