/**
 * Created by rbeyer on 4/1/17.
 */
import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {FieldProperties, __RewireAPI__ as FieldPropertiesRewireAPI} from '../../../../src/components/builder/builderMenus/fieldProperties';

const currentForm = {formData:{loading: false, formType: {}, formMeta: {}}, formBuilderChildrenTabIndex: ["0"], id: 'view'};
const selectedField = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 3};

let component;
let instance;

const mockActions = {
    updateField() {}
};

describe('FieldProperties', () => {

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'updateField');
    });

    it('test render of component', () => {
        component = shallow(<FieldProperties formId="view" currentForm={currentForm} selectedField={selectedField} fields={null}/>);
        instance = component.instance();

        instance.componentDidMount();
    });
});
