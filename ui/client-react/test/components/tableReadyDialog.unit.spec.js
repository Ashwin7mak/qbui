import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';
import {Simulate} from 'react-addons-test-utils';

import {TableReadyDialog} from '../../src/components/table/tableReadyDialog';

let component;
let domComponent;


describe('TableCreationDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.tableReadyDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('renders a TableReadyDialog', () => {
        const props = {
            tableCreation: {
                showTableReadyDialog: true
            },
            onFinished: () => {}
        };

        component = mount(<TableReadyDialog {...props}/>);

        domComponent = document.querySelector('.tableReadyDialog');

        expect(domComponent).not.toBeNull();
    });

    it('renders a closed TableReadyDialog', () => {
        const props = {
            tableCreation: {
                showTableReadyDialog: false
            },
            onFinished: () => {}
        };

        component = mount(<TableReadyDialog {...props}/>);

        domComponent = document.querySelector('.tableReadyDialog');

        expect(domComponent).toBeNull();
    });


    it('cancels the TableReadyDialog', () => {
        const props = {
            tableCreation: {
                showTableReadyDialog: true
            },
            onFinished: () => {}
        };

        spyOn(props,'onFinished');
        component = mount(<TableReadyDialog {...props}/>);

        domComponent = document.querySelector('.tableReadyDialog');

        let cancelButton = domComponent.querySelector('.cancelButton');
        expect(cancelButton).toBe(null);

        let finishedButton = domComponent.querySelector('.finishedButton');
        Simulate.click(finishedButton);

        expect(props.onFinished).toHaveBeenCalled();
    });
});
