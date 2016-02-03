import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import Nav from '../../src/components/nav/nav';
import * as breakpoints from '../../src/constants/breakpoints';

var LeftNavMock = React.createClass({
    render: function() {return <div className="leftMenu" ><a className="leftNavLink" onClick={() => this.props.onSelect()} >mock left nav</a></div>;}
});


var TopNavMock = React.createClass({
    render: function() {return <div>mock top nav</div>;}
});
var FooterMock = React.createClass({
    render: function() {return <div>mock footer</div>;}
});

describe('Nav functions', () => {
    'use strict';

    var component;
    let navStore = Fluxxor.createStore({
        getState: function(){
            return {leftNavOpen:true};
        }
    });
    let appStore = Fluxxor.createStore({
        getState: function(){
            return [];
        }
    });
    let reportsStore = Fluxxor.createStore({
        getState: function(){
            return [];
        }
    });
    let reportDataStore = Fluxxor.createStore({
        getState: function(){
            return [];
        }
    });
    let stores = {
        NavStore: new navStore(),
        AppsStore: new appStore(),
        ReportsStore: new reportsStore(),
        ReportDataStore: new reportDataStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.addActions({toggleLeftNav() {return;}});


    beforeEach(() => {
        Nav.__Rewire__('LeftNav', LeftNavMock);
        Nav.__Rewire__('TopNav', TopNavMock);
        Nav.__Rewire__('Footer', FooterMock);
    });

    afterEach(() => {
        Nav.__ResetDependency__('LeftNav');
        Nav.__ResetDependency__('TopNav');
        Nav.__ResetDependency__('Footer');
    });

    it('test render of component', () => {
        let MainComponent = React.createClass({
            render: function() {
                return (
                    <div>main component</div>
                );
            }
        });

        component = TestUtils.renderIntoDocument(<Nav flux={flux}></Nav>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test renders large by default', () => {
        component = TestUtils.renderIntoDocument(<Nav flux={flux}></Nav>);
        expect(TestUtils.scryRenderedComponentsWithType(component, LeftNavMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TopNavMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, FooterMock).length).toEqual(1);
    });

    it('test renders small based on break point', () => {
        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                breakpoint: React.PropTypes.string,
                touch: React.PropTypes.bool
            },
            getChildContext: function() {
                return {breakpoint: breakpoints.SMALL_BREAKPOINT, touch: true};
            },
            render() {
                return <Nav ref="nav" flux={flux}></Nav>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        component = parent.refs.nav;

        expect(TestUtils.scryRenderedComponentsWithType(component, LeftNavMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TopNavMock).length).toEqual(1);

        let leftLink = TestUtils.findRenderedDOMComponentWithClass(component, "leftNavLink");
        TestUtils.Simulate.click(leftLink);
    });

});
