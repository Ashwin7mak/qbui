import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBToolTip  from '../../src/components/qbToolTip/qbToolTip';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

describe('QBToolTip functions', () => {
    'use strict';

    beforeEach(() => {
        QBToolTip.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        QBToolTip.__ResetDependency__('I18nMessage');
    });


    it('test render of component empty', () => {
        try {
            let component = TestUtils.renderIntoDocument(<QBToolTip/>);
            expect(component).toBeFalsy(); // "component was wrapped, despite not passing in child");
        } catch (e) {
            expect(e).toBeTruthy();// "expect component was not wrapped");
        }
    });

    it('test render of component default', () => {
        let component = TestUtils.renderIntoDocument(<QBToolTip><span>something here</span></QBToolTip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with plain string', () => {
        let component = TestUtils.renderIntoDocument(<QBToolTip plainMessage="hello"><span>something here</span></QBToolTip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with i18nMessageKey', () => {
        let component = TestUtils.renderIntoDocument(<QBToolTip i18nMessageKey="test"><span>something here</span></QBToolTip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component with delay', () => {
        let component = TestUtils.renderIntoDocument(<QBToolTip delayStart={0} i18nMessageKey="test">
            <span>something here</span></QBToolTip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


});
