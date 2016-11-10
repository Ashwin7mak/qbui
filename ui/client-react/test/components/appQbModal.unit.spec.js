import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import AppQbModal from '../../src/components/qbModal/appQbModal';

let component;
let domComponent;

describe('AppQbModal', () => {
    it('renders', () => {
        component = TestUtils.renderIntoDocument(<AppQbModal/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});

