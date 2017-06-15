import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {AppsRoute, __RewireAPI__ as AppsRouteRewireAPI}  from '../../src/components/apps/appsRoute';
import HtmlUtils from '../../src/utils/htmlUtils';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import {DEFAULT_PAGE_TITLE} from '../../src/constants/urlConstants';
import {mount, shallow} from 'enzyme';


//TODO this is a placeholder file to add tests as apps home page gets built out

class WindowLocationUtilsMock {
    static update(url) { }
}


describe('AppsRoute functions', () => {
    'use strict';

    let component;
    let props = {
        showTopNav: () => {}
    };

    let mockRealm = 'Sinatra';

    beforeEach(() => {
        spyOn(WindowLocationUtils, 'getHostname').and.returnValue(mockRealm);

        spyOn(HtmlUtils, 'updatePageTitle');
    });

    it('test render of component', () => {
        let store = null;
        component = shallow(<AppsRoute {...props}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('sets the page title to the realm name', () => {
        let store = null;
        component = mount(<AppsRoute {...props} />);
        expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(`${mockRealm} - ${DEFAULT_PAGE_TITLE}`);
    });
});

