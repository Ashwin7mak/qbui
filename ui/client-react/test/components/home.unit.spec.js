import Fluxxor from 'fluxxor';
import React from 'react/addons';
import Home  from '../../src/components/apps/home';
import Store from '../../src/stores/appsStore'

//TODO this is a placeholder file to add tests as table home page gets built out
var TestUtils = React.addons.TestUtils;

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
        Home.__Rewire__('AppsHeader', AppsHeaderMock);
        Home.__Rewire__('AppsList', AppsListMock);
    });

    afterEach(() => {
        Home.__ResetDependency__('AppsHeader', AppsHeaderMock);
        Home.__ResetDependency__('AppsList', AppsListMock);
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<Home flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

});
