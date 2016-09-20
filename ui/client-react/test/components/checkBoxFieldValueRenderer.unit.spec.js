import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import CheckBoxFieldValueRenderer  from '../../src/components/fields/checkBoxFieldValueRenderer';

let I18nMessageMock = React.createClass({
    render: function() {
        if (this.props.message === 'fields.checkbox.yes') {
            return <span>Yes</span>;
        } else if (this.props.message === 'fields.checkbox.no') {
            return <span>No</span>;
        }
    }
});

let component;

function findElements(query) {
    return ReactDOM.findDOMNode(component).querySelectorAll(query);
};

function it_is_unchecked(){
    let unCheckedCheckbox = findElements('.checkbox-unchecked');
    expect(unCheckedCheckbox.length).toBe(1);
}

function it_is_checked() {
    let checkedCheckbox = findElements('.iconssturdy-check');
    expect(checkedCheckbox.length).toBe(1);
}

function it_does_not_have_a_label() {
    let labels = findElements('label');
    expect(labels.length).toBe(0);
}

function it_has_a_label(text = null) {
    let labels = findElements('label');

    expect(labels.length).toBe(1);

    if(text) {
        expect(labels[0].textContent).toBe(text);
    }
}

function it_has_an_optional_class(className) {
    let checkBox = findElements('span');
    expect(checkBox[0].className).toContain(className);
}

beforeEach(() => {
    CheckBoxFieldValueRenderer.__Rewire__('I18nMessage', I18nMessageMock);
});

afterEach(() => {
    CheckBoxFieldValueRenderer.__ResetDependency__('I18nMessage');
});

describe('CheckBoxFieldValueRenderer', () => {
    it('has a default of an unchecked checkbox without a label', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer />);
        it_is_unchecked();
        it_does_not_have_a_label();
    });

    it('has a checkmark when the value is true', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer value={true} />);
        it_is_checked();
        it_does_not_have_a_label();
    });

    it('has an optional label', () => {
        let labelText = 'Test Label';
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer label={labelText} />);
        it_has_a_label(labelText);
    });

    it('displays yes/no instead of checkmarks when displayGraphic is false', () => {
        let checkBoxText;

        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer displayGraphic={false} />);
        checkBoxText = findElements('span');
        expect(checkBoxText[0].textContent).toBe('No');

        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer displayGraphic={false} value={true} />);
        checkBoxText = findElements('span');
        expect(checkBoxText[0].textContent).toBe('Yes');
    });

    it('can optionally have a different checked and unchecked icons', () => {
        let optionalClass = 'test-class';

        // Unchecked
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer uncheckedIconClass={optionalClass} />);
        it_has_an_optional_class(optionalClass);

        // Checked
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer checkedIconClass={optionalClass} value={true} />);
        it_has_an_optional_class(optionalClass);
    });

    it('hides the unchecked icons when hideUncheckedCheckbox is true', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueRenderer hideUncheckedCheckbox={true} />);

        let checkBox = ReactDOM.findDOMNode(component);
        expect(checkBox.childElementCount).toBe(0);
    });
});
