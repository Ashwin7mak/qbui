import React from 'react';

import ReactDOM from 'react-dom';
import Trouser  from '../../src/components/trouser/trouser';

import TestUtils from 'react-addons-test-utils';


describe('Trouser functions', () => {
    'use strict';

    var component;

    it('test render of visible trouser', () => {
        component = TestUtils.renderIntoDocument(<Trouser visible={true} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of invisible trouser', () => {
        component = TestUtils.renderIntoDocument(<Trouser visible={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test hide of trouser', () => {
        var TestParent = React.createFactory(React.createClass({

            getInitialState() {
                return {trouserOpen:true};
            },
            hideTrouserExample() {
                this.setState({trouserOpen:false});
            },
            render() {
                return <Trouser ref="trouser" visible={this.state.trouserOpen} onHide={this.hideTrouserExample}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        expect(TestUtils.isCompositeComponent(parent.refs.trouser)).toBeTruthy();

        //TestUtils.Simulate.keyDown(parent.refs.trouser, {keyCode : 27});
        //expect(parent.refs.trouser.props.visible).toBeFalsy();
    });
});
