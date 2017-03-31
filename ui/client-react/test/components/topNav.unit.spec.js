import React from 'react';

import TopNav from '../../src/components/header/topNav';
import GlobalActions from '../../src/components/actions/globalActions';
import {mount, shallow} from 'enzyme';

describe('TopNav functions', () => {
    'use strict';

    let props = {
        showOnSmall: false,
        title: 'mockTitle'
    };

    it('test render of topNav', () => {
        let wrapper = shallow(<TopNav {...props}/>);
        let navGroup = wrapper.find('.topNav');
        expect(navGroup.length).toBe(1);
    });

    var testCasesSmall = [
        {name:'test topNav with showOnSmall true', showOnSmall: true, expectation: 0},
        {name:'test topNav with showOnSmall true', showOnSmall: false, expectation: 1}
    ];
    testCasesSmall.forEach(testCase => {
        it(testCase.name, () => {
            let wrapper = shallow(<TopNav {...props} showOnSmall={testCase.showOnSmall}/>);
            let hideSmall = wrapper.find('.hideSmall');
            expect(hideSmall.length).toBe(testCase.expectation);
        });
    });

    var testCasesTitle = [
        {name:'test topNav with title', title: 'mockTitle', expectation: 1},
        {name:'test topNav with no title', title: '', expectation: 0}
    ];
    testCasesTitle.forEach(testCase => {
        it(testCase.name, () => {
            let wrapper = shallow(<TopNav {...props} title={testCase.title}/>);
            let title = wrapper.find('.topTitle');
            expect(title.length).toBe(testCase.expectation);
        });
    });

});
