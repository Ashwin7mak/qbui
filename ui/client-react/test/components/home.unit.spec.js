import Fluxxor from 'fluxxor';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Home, {__RewireAPI__ as HomeRewireAPI}  from '../../src/components/apps/home';
import Store from '../../src/stores/appsStore';

//TODO this is a placeholder file to add tests as table home page gets built out

var AppsHeaderMock = React.createClass({
    render: function() {
        return (
            <div>Header</div>
        );
    }
});
var AppsListMock = React.createClass({
    render: function() {
        return (
            <div>List</div>
        );
    }
});

describe('Home page functions', () => {
    'use strict';

    let component;

    let store = new Store();
    let stores = {AppsStore: store};
    let flux = new Fluxxor.Flux(stores);

    beforeEach(() => {
        HomeRewireAPI.__Rewire__('AppsHeader', AppsHeaderMock);
        HomeRewireAPI.__Rewire__('AppsList', AppsListMock);
    });

    afterEach(() => {
        HomeRewireAPI.__ResetDependency__('AppsHeader', AppsHeaderMock);
        HomeRewireAPI.__ResetDependency__('AppsList', AppsListMock);
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<Home flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, AppsHeaderMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, AppsListMock).length).toEqual(1);
    });

});
