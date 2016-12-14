import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppsRoute  from '../../src/components/apps/appsRoute';
import HtmlUtils from '../../src/utils/htmlUtils';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import {DEFAULT_PAGE_TITLE} from '../../src/constants/urlConstants';

//TODO this is a placeholder file to add tests as apps home page gets built out

class WindowLocationUtilsMock {
    static update(url) { }
}


describe('AppsRoute functions', () => {
    'use strict';

    let component;
    let flux = {
        actions:{
            showTopNav() {return;},
            setTopTitle() {return;}
        }
    };

    let mockRealm = 'Sinatra';

    beforeEach(() => {
        AppsRoute.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);

        spyOn(WindowLocationUtils, 'getHostname').and.returnValue(mockRealm);

        spyOn(HtmlUtils, 'updatePageTitle');
    });

    afterEach(() => {
        AppsRoute.__ResetDependency__('WindowLocationUtils');
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('sets the page title to the realm name', () => {
        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux} />);
        expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(`${mockRealm} - ${DEFAULT_PAGE_TITLE}`);
    });

    it('redirects to error page if non admin user has no v3 apps', () => {
        spyOn(WindowLocationUtilsMock, 'update');

        const apps = [
            {id:"1", accessRights: {appRights: []}, openInV3: false},
            {id:"2", accessRights: {appRights: ["READ"]}, openInV3: false},
            {id:"3", accessRights: {appRights: ["READ", "MANAGE_USERS"]}, openInV3: false}
        ];

        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux} apps={apps}/>);

        expect(WindowLocationUtilsMock.update).toHaveBeenCalledWith("/qbase/notAvailable");
    });

    it('does not redirect to error page if non admin user has a v3 app', () => {
        spyOn(WindowLocationUtilsMock, 'update');

        const apps = [
            {id:"1", accessRights: {appRights: ["READ"]}, openInV3: true}
        ];

        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux} apps={apps}/>);

        expect(WindowLocationUtilsMock.update).not.toHaveBeenCalled();
    });

    it('does not redirect to error page if admin user has no v3 apps', () => {
        spyOn(WindowLocationUtilsMock, 'update');

        const apps = [
            {id:"1", accessRights: {appRights: ["EDIT_SCHEMA"]}, openInV3: false}
        ];

        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux} apps={apps}/>);

        expect(WindowLocationUtilsMock.update).not.toHaveBeenCalled();
    });
});

