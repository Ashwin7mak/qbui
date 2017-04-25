import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Tooltip, {__RewireAPI__ as TooltipRewireAPI}  from '../../src/components/tooltip/tooltip';

const I18nMessageMock = () => <div>test</div>;

describe('Tooltip functions', () => {
    'use strict';

    beforeEach(() => {
        TooltipRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        TooltipRewireAPI.__ResetDependency__('I18nMessage');
    });


    it('test render of component empty', () => {
        let component = TestUtils.renderIntoDocument(<Tooltip/>);
        expect(component).toBeTruthy();// "expect component was wrapped");
    });

    it('test render of component several children', () => {
        let component = TestUtils.renderIntoDocument(<Tooltip><span>test</span><div>xyz</div></Tooltip>);
        expect(component).toBeTruthy();// "expect component was wrapped");
    });

    it('test render of component default', () => {
        let component = TestUtils.renderIntoDocument(<Tooltip><span>something here</span></Tooltip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with plain string', () => {
        let component = TestUtils.renderIntoDocument(<Tooltip plainMessage="hello"><span>something here</span></Tooltip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with i18nMessageKey', () => {
        let component = TestUtils.renderIntoDocument(<Tooltip i18nMessageKey="test"><span>something here</span></Tooltip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component with delay', () => {
        let component = TestUtils.renderIntoDocument(<Tooltip delayStart={0} i18nMessageKey="test"><span>something here</span></Tooltip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
