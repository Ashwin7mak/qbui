import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import QbModal from '../../src/components/qbModal/qbModal';

let component;
let domComponent;

let qbModalClass = '.qbModal';

let testTitle = 'Modal Title';
let testBodyMessage = 'I am a modal!';
let testPrimaryText = 'Primary Button';
let testMiddleText = 'Middle Button';
let testLeftText = 'Left Button';

let alertType = 'alert';
let alertIconClass = `iconTableUISturdy-alert`;
let successType = 'success';
let successIconClass = `iconTableUISturdy-check-reversed`;
let standardType = 'standard';
let isBusyType = 'isBusy';


function buildMockParent(options = {show: false, title: null, bodyMessage: null, type: null}) {
    return React.createClass({
        getInitialState() {
            return {
                show: options.show
            };
        },
        onClick() {
            this.setState({show: !this.state.show});
        },
        render() {
            return (
                <QbModal show={this.state.show} title={options.title} bodyMessage={options.bodyMessage} type={options.type} />
            );
        }
    });
}

function buildMockParentComponent(options) {
    return TestUtils.renderIntoDocument(React.createElement(buildMockParent(options)));
}

describe('QbModal', () => {

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector(qbModalClass);
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('can be shown', () => {
        component = buildMockParentComponent({show: true});

        // The modal is not rendered inside of the react element, but is instead appended to the DOM as a dialog
        // <div data-reactroot="" role="dialog">
        domComponent = document.querySelector(qbModalClass);

        expect(domComponent).not.toBeNull();
    });

    it('can be hidden', () => {
        component = buildMockParentComponent();
        domComponent = document.querySelector(qbModalClass);

        expect(domComponent).toBeNull();
    });

    it('can have a title', () => {
        component = buildMockParentComponent({show: true, title: testTitle});

        let modalTitle = document.querySelector(`${qbModalClass} .title`);

        expect(modalTitle.textContent).toEqual(testTitle);
    });

    it('can have a message', () => {
        component = buildMockParentComponent({show: true, bodyMessage: testBodyMessage});

        domComponent = document.querySelector('.modal-body');

        expect(domComponent.textContent).toContain(testBodyMessage);
    });

    it('can have a primary button', () => {
        let mockParent = {
            onPrimaryClick() {}
        };
        spyOn(mockParent, 'onPrimaryClick');

        component = TestUtils.renderIntoDocument(<QbModal show={true}
                                                          title={testTitle}
                                                          primaryButtonName={testPrimaryText}
                                                          primaryButtonOnClick={mockParent.onPrimaryClick} />);

        let primaryButton = document.querySelector(`${qbModalClass} .primaryButton`);

        Simulate.click(primaryButton);

        expect(primaryButton.textContent).toEqual(testPrimaryText);
        expect(mockParent.onPrimaryClick).toHaveBeenCalled();
    });

    it('can have no buttons', () => {

        component = TestUtils.renderIntoDocument(<QbModal show={true}
                                                          bodyMessage={testBodyMessage} />);

        let primaryButton = document.querySelector(`${qbModalClass} .primaryButton`);

        expect(primaryButton).toBeNull();
    });

    it('can have a middle button', () => {
        let mockParent = {
            onMiddleClick() {}
        };
        spyOn(mockParent, 'onMiddleClick');

        component = TestUtils.renderIntoDocument(<QbModal show={true}
                                                          title={testTitle}
                                                          primaryButtonName={testPrimaryText}
                                                          middleButtonName={testMiddleText}
                                                          middleButtonOnClick={mockParent.onMiddleClick} />);

        let middleButton = document.querySelector(`${qbModalClass} .middleButton`);

        Simulate.click(middleButton, {});

        expect(middleButton.textContent).toEqual(testMiddleText);
        expect(mockParent.onMiddleClick).toHaveBeenCalled();
    });

    it('can have a left button', () => {
        let mockParent = {
            onLeftClick() {}
        };
        spyOn(mockParent, 'onLeftClick');

        component = TestUtils.renderIntoDocument(<QbModal show={true}
                                                          title={testTitle}
                                                          primaryButtonName={testPrimaryText}
                                                          leftButtonName={testLeftText}
                                                          leftButtonOnClick={mockParent.onLeftClick} />);

        let leftButton = document.querySelector(`${qbModalClass} .leftButton`);

        Simulate.click(leftButton, {});

        expect(leftButton.textContent).toEqual(testLeftText);
        expect(mockParent.onLeftClick).toHaveBeenCalled();
    });

    // Test cases for different modal types
    let modalTypeTestCases = [
        {
            description: 'can show an alert modal type with an alert icon',
            modalType: alertType,
            iconClass: alertIconClass
        },
        {
            description: 'can show an alert modal type with an alert icon',
            modalType: isBusyType,
        },
        {
            description: 'can show a success modal type with a check icon',
            modalType: successType,
            iconClass: successIconClass
        },
        {
            description: 'can show a default standard type modal with no icon',
            modalType: standardType,
            iconClass: null
        },
        {
            description: 'does not display an icon for an invalid/unknown modal type',
            modalType: 'unknown',
            iconClass: null
        }
    ];

    modalTypeTestCases.forEach(modalTypeTestCase => {
        it(modalTypeTestCase.description, () => {
            component = buildMockParentComponent({show: true, title: testTitle, type: modalTypeTestCase.modalType});

            let modalIcon = document.querySelector(`${qbModalClass} .qbIcon`);

            if (modalTypeTestCase.iconClass) {
                expect(modalIcon).not.toBeNull();
                expect(modalIcon.classList).toContain(modalTypeTestCase.iconClass);
            } else {
                expect(modalIcon).toBeNull();
            }
        });
    });

    it('can have a loader', () => {
        component = buildMockParentComponent({show: true, body:{testBodyMessage}, type: isBusyType});

        let loader = document.querySelector(`${qbModalClass} .loader`);
        expect(loader).not.toBeNull();
    });
});
