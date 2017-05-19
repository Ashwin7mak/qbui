import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ErrorWrapper, {__RewireAPI__ as ErrorWrapperRewireAPI}  from '../../src/components/fields/errorWrapper';
import Breakpoints from '../../src/utils/breakpoints';

class BreakpointsAlwaysSmallMock {

    static isSmallBreakpoint() {
        return true;
    }
}
class DeviceIsTouch {
    static isTouch() {
        return true;
    }
}

describe('ErrorWrapper functions', () => {
    'use strict';

    let component;


    it('test render of component with no children', () => {
        try {
            component = TestUtils.renderIntoDocument(<ErrorWrapper  />);
            expect(component).toBeFalsy();// "expect component was not created");
        } catch (e) {
            expect(e).toBeTruthy();// "expect component was not created without child");
        }
    });

    it('test render of component with child', () => {
        component = TestUtils.renderIntoDocument(
            <ErrorWrapper>
               <div> that's all </div>
             </ErrorWrapper>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with invalid child', () => {
        component = TestUtils.renderIntoDocument(
                    <ErrorWrapper
                        isInvalid={true}
                        invalidMessage={"somethings wrong"}>
                        <div>bad news</div>
                    </ErrorWrapper>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component on small breakpoint', () => {
        ErrorWrapperRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        ErrorWrapperRewireAPI.__Rewire__('Device', DeviceIsTouch);
        component = TestUtils.renderIntoDocument(
            <ErrorWrapper isInvalid={true}
                          invalidMessage={"somethings wrong"}>
                <div> that's all </div>
            </ErrorWrapper>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let errorDiv = TestUtils.scryRenderedDOMComponentsWithClass(component, "errorDiv");
        expect(errorDiv.length).toBe(1);
        let errorText = TestUtils.scryRenderedDOMComponentsWithClass(component, "errorText");
        expect(errorText.length).toBe(1);
        expect(errorText[0].innerHTML).toBe("somethings wrong");
        ErrorWrapperRewireAPI.__ResetDependency__('Breakpoints');
    });

});
