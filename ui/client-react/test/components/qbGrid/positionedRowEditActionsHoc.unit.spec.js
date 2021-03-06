import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import positionedRowEditActions from '../../../src/components/dataTable/qbGrid/positionedRowEditActionsHoc';

const MockComponent = (props) => {return <div>mock</div>;};

let component;
let instance;

describe('RowEditActionsPositionHoc (QbGrid)', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    /**
     * We can't directly test the position of the element in a fake DOM; however, we can test the function that
     * places the element and ensure it returns the correct styles.
     */
    describe('calculatePosition', () => {
        const styles = {
            top: 0,
            left: 0,
            position: 'absolute',
            zIndex: 1
        };

        const testCases = [
            {
                description: 'aligns the middle of its child element with the middle of the containing element',
                parentHeight: 100,
                parentWidth: 100,
                componentHeight: 200,
                componentWidth: 200,
                expectedTop: -50,
                expectedLeft: -100
            },
            {
                description: 'aligns the middle of its child element with the middle of the containing element',
                parentHeight: 200,
                parentWidth: 200,
                componentHeight: 100,
                componentWidth: 100,
                expectedTop: 50,
                expectedLeft: 100
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let PositionedMockComponent = positionedRowEditActions(MockComponent);
                component = shallow(<PositionedMockComponent/>);
                instance = component.instance();

                let expectedStyles = {
                    top: testCase.expectedTop,
                    left: testCase.expectedLeft,
                    position: 'absolute',
                    zIndex: 1
                };

                let actualStyles = instance.calculatePosition(
                    testCase.parentHeight,
                    testCase.parentWidth,
                    testCase.componentHeight,
                    testCase.componentWidth,
                    styles
                );

                expect(actualStyles).toEqual(expectedStyles);
            });
        });
    });
});
