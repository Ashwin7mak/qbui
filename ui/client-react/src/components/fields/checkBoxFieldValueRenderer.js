import React, {PropTypes} from 'react';
import './checkbox';

let defaultSymbolClasses = 'symbol qbIcon ';

const CheckBoxFieldValueRenderer = React.createClass({
    propTypes: {
        value: PropTypes.bool,
        label: PropTypes.string,
        readOnly: PropTypes.bool,
        checkedIconClass: PropTypes.string,
        uncheckedIconClass: PropTypes.string
    },

    getDefaultProps() {
        return {
            // If not specified, the checkbox should NOT be checked
            value: false,
            readOnly: true,
            label: 'test',
            checkedIconClass: 'iconssturdy-check',
            uncheckedIconClass: ''
        };
    },

    renderDisplayValue() {
        if(this.props.value) {
            return this.renderCheckedSymbol();
        } else {
            return this.renderUncheckedSymbol();
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

    renderCheckedSymbol() {
        let classes = defaultSymbolClasses + this.props.checkedIconClass;
        return (<span className={classes}></span>);
    },

    renderUncheckedSymbol() {
        if(this.props.readOnly && this.props.uncheckedIconClass === '') {
            return <input type="checkbox" disabled checked={false} />;
        } else {
            let classes = defaultSymbolClasses + this.props.uncheckedIconClass;
            return (<span className={classes}></span>);
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
