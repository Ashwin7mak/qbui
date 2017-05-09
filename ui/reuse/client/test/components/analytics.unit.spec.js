import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {Analytics, EVERGAGE_ACCOUNT_NAME, ANALYTICS_SCRIPT_ID} from 'REUSE/components/analytics/analytics';

const mockDataset = 'unitTest'; // Use a non-existing dataset in case test accidentally makes a call to Everage

const mockExistingScriptElement = {
    parentNode: {
        insertBefore() {}
    }
};

let component;

describe('Analytics', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('does not add more than one everage script to the page', () => {
        spyOn(document, 'getElementById').and.returnValue(true);
        spyOn(document, 'createElement');

        component = shallow(<Analytics dataset={mockDataset} />);
        component.instance().componentDidMount();

        expect(document.createElement).not.toHaveBeenCalled();
    });

    it('does not add the evergage script if there is no dataset specified', () => {
        spyOn(document, 'getElementById').and.returnValue(false);
        spyOn(document, 'createElement');

        component = shallow(<Analytics />);
        component.instance().componentDidMount();

        expect(document.createElement).not.toHaveBeenCalled();
    });

    it('logs an error if the evergage script could not be setup', () => {
        component = shallow(<Analytics dataset={mockDataset}/>);
        let instance = component.instance();

        spyOn(instance.logger, 'error');
        spyOn(instance, 'setupEvergage').and.throwError('test error');

        instance.componentDidMount();

        expect(instance.logger.error).toHaveBeenCalled();
    });

    it('adds the evergage script to the page if it does not exist', () => {
        let testMockElement = {};
        spyOn(document, 'getElementById').and.returnValue(false);
        spyOn(document, 'createElement').and.returnValue(testMockElement);
        spyOn(document, 'getElementsByTagName').and.returnValue([mockExistingScriptElement]);

        component = shallow(<Analytics dataset={mockDataset} />);
        component.instance().componentDidMount();

        expect(document.createElement).toHaveBeenCalledWith('script');
        expect(testMockElement.type).toEqual('text/javascript');
        expect(testMockElement.id).toEqual(ANALYTICS_SCRIPT_ID);
        expect(testMockElement.async).toEqual(true);
        expect(testMockElement.src).toEqual(`http://cdn.evergage.com/beacon/${EVERGAGE_ACCOUNT_NAME}/${mockDataset}/scripts/evergage.min.js`);
    });

    it('removes the evergage script from the page if it exists', () => {
        let testMockElement = {remove() {}};
        spyOn(testMockElement, 'remove');
        spyOn(document, 'getElementById').and.returnValue(testMockElement);

        component = shallow(<Analytics dataset={mockDataset} />);
        component.instance().componentWillUnmount();

        expect(testMockElement.remove).toHaveBeenCalled();
    });

    it('does not remove the evergage script if it does not exist', () => {
        spyOn(document, 'getElementById').and.returnValue(false);

        component = shallow(<Analytics dataset={mockDataset} />);

        expect(component.instance().componentWillUnmount).not.toThrow();
    });

    describe('updating the user', () => {
        const testFirstUserId = 1;

        beforeEach(() => {
            // Don't add the script to the page during these tests
            spyOn(document, 'getElementById').and.returnValue(true);
        });

        it('updates the current user when the prop changes', () => {
            const testSecondUserId = 2;

            component = shallow(<Analytics dataset={mockDataset} userId={testFirstUserId} />);
            let instance = component.instance();
            spyOn(instance, 'updateEvergageUser');

            component.setProps({userId: testSecondUserId});

            expect(instance.updateEvergageUser).toHaveBeenCalledWith(testSecondUserId);
        });

        it('does not update the current user if the userId prop does not change', () => {
            component = shallow(<Analytics dataset={mockDataset} userId={testFirstUserId} />);
            let instance = component.instance();
            spyOn(instance, 'updateEvergageUser');

            component.setProps({userId: testFirstUserId});

            expect(instance.updateEvergageUser).not.toHaveBeenCalled();
        });
    });
});
