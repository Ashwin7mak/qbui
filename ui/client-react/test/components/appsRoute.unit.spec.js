import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppsRoute  from '../../src/components/apps/appsRoute';
import HtmlUtils from '../../src/utils/htmlUtils';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import {DEFAULT_PAGE_TITLE} from '../../src/constants/urlConstants';

//TODO this is a placeholder file to add tests as apps home page gets built out

describe('AppsRoute functions', () => {
    'use strict';

    let component;
    let flux = {
        actions:{
            showTopNav: function() {return;},
            setTopTitle: function() {return;}
        }
    };

    let mockRealm = 'Sinatra';

    beforeEach(() => {
        spyOn(WindowLocationUtils, 'getHostname').and.returnValue(mockRealm);
        spyOn(HtmlUtils, 'updatePageTitle');
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('sets the page title to the realm name', () => {
        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux} />);
        expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(`${mockRealm} - ${DEFAULT_PAGE_TITLE}`);
    });
});
