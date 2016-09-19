import React, {PropTypes} from 'react';
import './checkbox';

import I18nMessage from '../../utils/i18nMessage';

let defaultSymbolClasses = 'symbol qbIcon ';

const CheckBoxFieldValueRenderer = React.createClass({
    propTypes: {
        value: PropTypes.bool,
        label: PropTypes.string,
        checkedIconClass: PropTypes.string,
        uncheckedIconClass: PropTypes.string,
        displayGraphic: PropTypes.bool
    },

    getDefaultProps() {
        return {
            // If not specified, the checkbox should NOT be checked
            value: false,
            label: '',
            checkedIconClass: 'iconssturdy-check',
            uncheckedIconClass: '',
            displayGraphic: true
        };
    },

    renderDisplayValue() {
        if(this.props.displayGraphic) {
            return this.renderGraphicDisplayValue();
        } else {
            return this.renderTextDisplayValue();
        }
    },

    renderTextDisplayValue() {
        if(this.props.value) {
            return "Yes";
            // return <I18nMessage message="fields.checkbox.yes" />;
        } else {
            return "No";
            // return <I18nMessage message="fields.checkbox.no" />;
        }
    },

    renderGraphicDisplayValue() {
        if(this.props.value) {
            return this.renderGraphicCheckedSymbol();
        } else {
            return this.renderGraphicUncheckedSymbol();
        }
    },

    renderGraphicCheckedSymbol() {
        let classes = defaultSymbolClasses + this.props.checkedIconClass;
        return (<span className={classes}></span>);
    },

    renderGraphicUncheckedSymbol() {
        if(this.props.readOnly && this.props.uncheckedIconClass === '') {
            return <input type="checkbox" disabled checked={false} />;
        } else {
            let classes = defaultSymbolClasses + this.props.uncheckedIconClass;
            return (<span className={classes}></span>);
        }
    },

    hasLabel() {
        let label = this.props.label;
        return label && label.length;
    },

    renderLabel() {
        if(this.hasLabel()) {
            return (<label className="label">{this.props.label}</label>);
        } else {
            return null;
        }
    },

    render() {
        let classes = "checkbox renderer";
        classes += (this.hasLabel() ? ' hasLabel' : '');

        return (
            <div className={classes}>
                {this.renderDisplayValue()}
                {this.renderLabel()}
            </div>
        );
    }
});

export default CheckBoxFieldValueRenderer;
