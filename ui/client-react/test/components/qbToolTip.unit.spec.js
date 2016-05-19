import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBToolTip  from '../../src/components/toolTip/toolTipper';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

/* TODO: When the expand/collapse behavior is added, add related tests */

fdescribe('QBToolTip functions', () => {
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


});
