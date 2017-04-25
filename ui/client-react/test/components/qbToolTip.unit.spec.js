import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBToolTip, {__RewireAPI__ as QBToolTipRewireAPI}  from '../../src/components/qbToolTip/qbToolTip';

const I18nMessageMock = () => <div>test</div>;

describe('QBToolTip functions', () => {
    'use strict';

    beforeEach(() => {
        QBToolTipRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        QBToolTipRewireAPI.__ResetDependency__('I18nMessage');
    });


    // Keep this test to ensure the stub is still working until the stub is removed
    it('test render of component default', () => {
        let component = TestUtils.renderIntoDocument(<QBToolTip><span>something here</span></QBToolTip>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
