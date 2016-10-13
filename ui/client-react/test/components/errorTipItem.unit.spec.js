import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ErrorTipItem  from '../../src/components/qbToolTip/errorTipItem';

describe('ErrorTipItem functions', () => {
    'use strict';

    let component;


    it('test render of component with no children', () => {
        try {
            component = TestUtils.renderIntoDocument(<ErrorTipItem  />);
            expect(component).toBeFalsy();// "expect component was not created");
        } catch (e) {
            expect(e).toBeTruthy();// "expect component was not created without child");
        }
    });

    it('test render of component with child', () => {
        component = TestUtils.renderIntoDocument(
            <ErrorTipItem>
               <div> that's all </div>
             </ErrorTipItem>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with invalid child', () => {
        component = TestUtils.renderIntoDocument(
                    <ErrorTipItem
                        isInvalid={true}
                        invalidMessage={"somethings wrong"}>
                        <div>bad news</div>
                    </ErrorTipItem>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


});
