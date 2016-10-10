import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {Nav, __RewireAPI__ as NavRewireAPI} from '../../src/components/nav/nav';

var LeftNavMock = React.createClass({
    render: function() {
        return <div className="leftMenu"><a className="leftNavLink" onClick={() => this.props.onSelect()}>mock left
            nav</a></div>;
    }
});

var TrowserMock = React.createClass({
    render: function() {
        return <div>mock trowser</div>;
    }
});
var TopNavMock = React.createClass({
    render: function() {
        return <div>mock top nav</div>;
    }
});

describe('Nav functions', () => {
    'use strict';

    var component;
    let navStore = Fluxxor.createStore({
        getState: function() {
            return {leftNavOpen: true};
        }
    });
    let appStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let reportsStore = Fluxxor.createStore({
        getState: function() {
            return {list: []};
        }
    });
    let reportDataStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let recordPendingEditsStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let fieldsStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let formStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let stores = {
        NavStore: new navStore(),
        AppsStore: new appStore(),
        ReportsStore: new reportsStore(),
        ReportDataStore: new reportDataStore(),
        RecordPendingEditsStore: new recordPendingEditsStore(),
        FieldsStore : new fieldsStore(),
        FormStore : new formStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.addActions({
        toggleLeftNav() {
            return;
        }
    });


    beforeEach(() => {
        NavRewireAPI.__Rewire__('LeftNav', LeftNavMock);
        NavRewireAPI.__Rewire__('RecordTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('ReportManagerTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('TopNav', TopNavMock);
    });

    afterEach(() => {
        NavRewireAPI.__ResetDependency__('LeftNav');
        NavRewireAPI.__ResetDependency__('RecordTrowser');
        NavRewireAPI.__ResetDependency__('ReportManagerTrowser');
        NavRewireAPI.__ResetDependency__('TopNav');
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
    });

    it('test renders small based on break point', () => {
        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                touch: React.PropTypes.bool
            },
            getChildContext: function() {
                return {touch: true};
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
