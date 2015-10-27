//import Fluxxor from 'fluxxor';
import React from 'react/addons';
import AppsList  from '../../src/components/apps/appsList';

//TODO this is a placeholder file to add tests as table home page gets built out
var TestUtils = React.addons.TestUtils;

let appsdata_empty = {
    apps:[]
};

let appsdata_valid = {
    apps: [{
        aliases: {
            _DBID_ACTIVITIES: "bkac9mqge"
        },
        dateFormat: "MM-dd-uuuu",
        firstDayOfWeek: 1,
        id: "bkac9mqfh",
        lastAccessed: null,
        name: "app_YvujdPIsBs",
        relationships: [],
        tables: [],
        timeZone: "US/Pacific"
    },
        {
            aliases: {
                _DBID_ACTIVITIES: "abc"
            },
            dateFormat: "MM-dd-uuuu",
            firstDayOfWeek: 1,
            id: "bkac9mqfh",
            lastAccessed: null,
            name: "app_YvujdPIsBs1",
            relationships: [],
            tables: [],
            timeZone: "US/Pacific"
        }]
};


/* TODO: this is just testing rendering since this is a dev-only feature as of this writing*/
describe('AppsList functions', () => {
    'use strict';

    let component;


    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppsList data={appsdata_empty}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with apps', () => {
        component = TestUtils.renderIntoDocument(<AppsList data={appsdata_valid}/>);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, "app").length).toEqual(2);
    });

});
