import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {__RewireAPI__ as FormBuilderRewireAPI} from '../../../src/components/formBuilder/formBuilder';
import {FormBuilder} from '../../../src/components/formBuilder/formBuilder';

const mockFormData = {formMeta: {tabs: [{orderIndex: 0,
    sections: [{orderIndex: 1,
        columns: [{orderIndex: 2,
            rows: [{orderIndex: 3,
                elements: [{orderIndex: 4}]
            }]
        }]
    }]
}]}};

const QbFormMock = React.createClass({
    render: function() {
        return <div>qbForm mock</div>;
    }
});

let component;
let instance;

describe('FormBuilder (drag/drop container)', () => {
    beforeEach(() => {
        FormBuilderRewireAPI.__Rewire__('QbForm', QbFormMock);
        jasmineEnzyme();
    });

    afterEach(() => {
        FormBuilderRewireAPI.__ResetDependency__('QbForm');
    });

    it('wraps QbForm in a drag drop container', () => {
        component = shallow(<FormBuilder formId={'view'} formData={mockFormData} showCustomDragLayer={false} />);
        instance = component.instance();

        expect(component.find('.formBuilderContainer')).toBePresent();

        let qbForm = component.find(QbFormMock);
        expect(qbForm).toBePresent();
        expect(qbForm).toHaveProp('edit', true);
        expect(qbForm).toHaveProp('editingForm', true);
        expect(qbForm).toHaveProp('formData', mockFormData);
    });
});
