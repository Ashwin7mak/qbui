import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import MultiStepDialog from '../../src/components/multiStepDialog/multiStepDialog';

let component;

const mockParentFunctions = {
    onCancel() {},
    onPrevious() {},
    onNext() {},
    onFinished() {}
};

describe('MultiStepDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a multi step dialog and responds to navigation', () => {

        spyOn(mockParentFunctions, 'onCancel');
        spyOn(mockParentFunctions, 'onNext');

        component = shallow(<MultiStepDialog show={true}
                                             loading={false}
                                             pageIndex={0}
                                             classes="classOne classTwo"
                                             onCancel={mockParentFunctions.onCancel}
                                             onPrevious={mockParentFunctions.onPrevious}
                                             onNext={mockParentFunctions.onNext}
                                             onFinished={mockParentFunctions.onFinished}
                                             canProceed={true}
                                             titleMessages={["Page 1", "Page 2"]}>

            <div>page 1</div>
            <div>page 2</div>
        </MultiStepDialog>);

        expect(component.find(".multiStepModal")).toBePresent();

        let nextButton = component.find('.nextButton').at(0);
        nextButton.simulate('click');
        expect(mockParentFunctions.onNext).toHaveBeenCalled();

        let cancelButton = component.find('.cancelButton').at(0);
        cancelButton.simulate('click');
        expect(mockParentFunctions.onCancel).toHaveBeenCalled();

        // ensure previous/finished aren't there
        let previousButton = component.find('.previousButton');
        expect(previousButton.length).toBe(0);

        let finishedButton = component.find('.finishedButton');
        expect(finishedButton.length).toBe(0);

        mockParentFunctions.onNext.calls.reset();
        mockParentFunctions.onCancel.calls.reset();
    });

    it('renders page 2 of a multi step dialog and responds to navigation', () => {

        spyOn(mockParentFunctions, 'onPrevious');
        spyOn(mockParentFunctions, 'onFinished');

        component = shallow(<MultiStepDialog show={true}
                                             loading={false}
                                             pageIndex={1}
                                             onCancel={mockParentFunctions.onCancel}
                                             onPrevious={mockParentFunctions.onPrevious}
                                             onNext={mockParentFunctions.onNext}
                                             onFinished={mockParentFunctions.onFinished}
                                             canProceed={true}
                                             titleMessages={["Page 1", "Page 2"]}>

            <div>page 1</div>
            <div>page 2</div>
        </MultiStepDialog>);

        expect(component.find(".multiStepModal")).toBePresent();

        let previousButton = component.find('.previousButton').at(0);
        previousButton.simulate('click');
        expect(mockParentFunctions.onPrevious).toHaveBeenCalled();

        let finishedButton = component.find('.finishedButton').at(0);
        finishedButton.simulate('click');
        expect(mockParentFunctions.onFinished).toHaveBeenCalled();

        // ensure next isn't there
        let nextButton = component.find('.nextButton');
        expect(nextButton.length).toBe(0);

        mockParentFunctions.onPrevious.calls.reset();
        mockParentFunctions.onFinished.calls.reset();
    });

    it('renders a multi step dialog when canProceed is false', () => {

        spyOn(mockParentFunctions, 'onCancel');
        spyOn(mockParentFunctions, 'onNext');

        component = shallow(<MultiStepDialog show={true}
                                             loading={false}
                                             pageIndex={0}
                                             classes="classOne classTwo"
                                             onCancel={mockParentFunctions.onCancel}
                                             onPrevious={mockParentFunctions.onPrevious}
                                             onNext={mockParentFunctions.onNext}
                                             onFinished={mockParentFunctions.onFinished}
                                             canProceed={false}
                                             titleMessages={["Page 1", "Page 2"]}>

            <div>page 1</div>
            <div>page 2</div>
        </MultiStepDialog>);

        expect(component.find(".multiStepModal")).toBePresent();

        let nextButton = component.find('.nextButton').at(0);
        expect(nextButton.prop('disabled')).toBeTruthy(); // enzyme fires clicks on disabled buttons!

        let cancelButton = component.find('.cancelButton').at(0);
        cancelButton.simulate('click');
        expect(mockParentFunctions.onCancel).toHaveBeenCalled();

        mockParentFunctions.onNext.calls.reset();
        mockParentFunctions.onCancel.calls.reset();
    });
});
