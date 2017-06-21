import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import FieldChoice, {__RewireAPI__ as FieldChoiceRewireAPI}  from '../../src/components/sortGroup/fieldChoice';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

let field_valid = function() {
    return {
        name: 'cider',
        descendOrder: false
    };
};

let field_empty = function() {
    return {
    };
};

let field_invalid = function() {
    return {
        name: 5,
        descendOrder: 'test',
    };
};


let type_group = 'group';
let type_sort = 'sort';
let type_invalid = 999;

describe('FieldChoice functions', () => {
    let component;
    let mockCallbacks = {};

    beforeEach(() => {
        jasmineEnzyme();

        mockCallbacks = {
            setOrder : function(type, index, order, field) {
            },
            removeField : function(type, index, field) {
            },
            showFields : function() {

            }
        };
        spyOn(mockCallbacks, 'setOrder').and.callThrough();
        spyOn(mockCallbacks, 'removeField').and.callThrough();
        spyOn(mockCallbacks, 'showFields').and.callThrough();

        FieldChoiceRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        FieldChoiceRewireAPI.__ResetDependency__('I18nMessage');
    });


    it('test render', () => {
        component = shallow(<FieldChoice />);

        expect(component).toBePresent();
    });

    it('test render blank item', () => {
        component = shallow(<FieldChoice />);

        expect(component.find('.fieldChoice')).toBePresent();

        expect(component.find('.sortOrderIcon')).not.toBePresent();
        expect(component.find('.fieldDeleteIcon')).not.toBePresent();
    });

    it('test render add new field', () => {
        component = shallow(<FieldChoice onShowFields={mockCallbacks.showFields}/>);
        expect(component).toBePresent();
    });

    it('test render with field', () => {
        component = shallow(<FieldChoice field={field_valid()}/>);

        expect(component.find('.up')).toBePresent();
    });

    it('test render with field descending', () => {
        let fieldTest = field_valid();
        fieldTest.descendOrder = true;
        component = shallow(<FieldChoice field={fieldTest} />);

        expect(component.find('.down')).toBePresent();
    });

    it('test render with invalid field', () => {
        component = shallow(<FieldChoice field={field_invalid()}/>);

        expect(component).toBePresent();
    });

    it('test render with invalid type', () => {
        component = shallow(<FieldChoice type={type_invalid}/>);
        expect(component).toBePresent();
    });

    it('test render with sort', () => {
        component = shallow(<FieldChoice type={type_sort} field={field_valid()}/>);
        expect(component).toBePresent();
    });

    it('test render with group', () => {
        component = shallow(<FieldChoice type={type_group} field={field_valid()}/>);
        expect(component).toBePresent();
    });

    it('test render order callback', () => {
        component = shallow(<FieldChoice type={type_group} onSetOrder={mockCallbacks.setOrder} field={field_valid()}/>);

        const sortIcon = component.find('.sortOrderIcon');
        expect(sortIcon).toBePresent();

        sortIcon.simulate('click');

        expect(mockCallbacks.setOrder).toHaveBeenCalled();
    });


    it('test render delete callback', () => {
        component = shallow(<FieldChoice type={type_group} onRemoveField={mockCallbacks.removeField} field={field_valid()}/>);

        const deleteIcon = component.find('.fieldDeleteIcon');
        expect(deleteIcon).toBePresent();

        deleteIcon.simulate('click');

        expect(mockCallbacks.removeField).toHaveBeenCalled();
    });

});

