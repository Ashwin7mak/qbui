import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {DraggableTokenInMenu} from '../../../../reuse/client/src/components/dragAndDrop/elementToken/draggableTokenInMenu';

let component;
let instance;

const title = 'New Textbox';
const selectedField = 1;
const mockActions = {
    addFieldToForm(_formId, _location, _field) {},
    onHoverBeforeAdded() {},
    onHover() {},
    endDrag() {}
};

describe('DraggableFieldTokenInMenu', () => {

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'addFieldToForm');
        spyOn(mockActions, 'onHoverBeforeAdded');
        spyOn(mockActions, 'onHover');
        spyOn(mockActions, 'endDrag');
    });

    it('will invoke addFieldToForm when FieldToken node is clicked', () => {
        component = shallow(<DraggableTokenInMenu title={title} onClickToken={mockActions.addFieldToForm} />);
        component.simulate('click');

        expect(mockActions.addFieldToForm).toHaveBeenCalledWith(component.instance().props);
    });

    it('will invoke addFieldToForm when FieldToken enter is pressed', () => {
        let e = {
            which: 13,
            preventDefault() {}
        };

        component = shallow(<DraggableTokenInMenu title={title} onClickToken={mockActions.addFieldToForm} />);
        instance = component.instance();
        instance.onEnterClickToAdd(e);

        expect(mockActions.addFieldToForm).toHaveBeenCalledWith(component.instance().props);
    });

    it('will invoke addFieldToForm when space is pressed', () => {
        let e = {
            which: 32,
            preventDefault() {}
        };

        component = shallow(<DraggableTokenInMenu title={title} onClickToken={mockActions.addFieldToForm} />);
        instance = component.instance();
        instance.onEnterClickToAdd(e);

        expect(mockActions.addFieldToForm).toHaveBeenCalledWith(component.instance().props);
    });

    it('will not invoke addFieldToForm when keys space or enter are pressed', () => {
        let e = {
            which: 9,
            preventDefault() {}
        };

        component = shallow(<DraggableTokenInMenu title={title} onClickToken={mockActions.addFieldToForm} />);
        instance = component.instance();
        instance.onEnterClickToAdd(e);

        expect(mockActions.addFieldToForm).not.toHaveBeenCalled();
    });

    it('adds a new field when dragging onto the form if the field has not been added yet', () => {
        component = shallow(<DraggableTokenInMenu
            onHoverBeforeAdded={mockActions.onHoverBeforeAdded}
            onHover={mockActions.onHover}
            title={title}
        />);

        instance = component.instance();
        instance.onHover({location: selectedField});

        expect(mockActions.onHoverBeforeAdded).toHaveBeenCalled();
        expect(mockActions.onHover).not.toHaveBeenCalled();
    });

    it('does not add a new field when dragging if the field has already been added', () => {
        component = shallow(<DraggableTokenInMenu
            onHoverBeforeAdded={mockActions.onHoverBeforeAdded}
            onHover={mockActions.onHover}
            title={title}
        />);
        instance = component.instance();
        component.setState({hasAttemptedDrop: true});

        instance.onHover();

        expect(mockActions.onHoverBeforeAdded).not.toHaveBeenCalled();
        expect(mockActions.onHover).toHaveBeenCalled();
    });

    it('resets the state when dragging is complete', () => {
        component = shallow(<DraggableTokenInMenu title={title} endDrag={mockActions.endDrag} />);
        instance = component.instance();
        component.setState({hasAttemptedDrop: true});

        instance.endDrag();

        expect(component).toHaveState('hasAttemptedDrop', false);
        expect(mockActions.endDrag).toHaveBeenCalledWith(component.instance().props);
    });
});
