import React from 'react';
import {App, __RewireAPI__ as HomeRewireAPI}  from '../../src/components/apps/home';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

let props = {
    getApps: () => {}
};

var AppsListMock = React.createClass({
    render: function() {
        return (
            <div>List</div>
        );
    }
});

describe('Home page functions', () => {
    'use strict';

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(props, 'getApps').and.callThrough();
        HomeRewireAPI.__Rewire__('AppsList', AppsListMock);
    });

    afterEach(() => {
        props.getApps.calls.reset();
        HomeRewireAPI.__ResetDependency__('AppsList', AppsListMock);
    });

    it('test render of component', () => {
        const component = mount(<App {...props}/>);
        expect(component).toBeDefined();
        expect(props.getApps).toHaveBeenCalled();

        let appsContainer = component.find('.apps-container');
        expect(appsContainer.length).toBe(1);
    });

});
