import React from 'react';

import ReactDOM from 'react-dom';
import Trowser  from '../../src/components/trowser/trowser';

import TestUtils from 'react-addons-test-utils';


describe('Trowser functions', () => {
    'use strict';

    var component;

    it('test render of visible trowser', () => {
        component = TestUtils.renderIntoDocument(<Trowser visible={true} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of invisible trowser', () => {
        component = TestUtils.renderIntoDocument(<Trowser visible={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test hide of trowser', () => {
        var TestParent = React.createFactory(React.createClass({

            getInitialState() {
                return {trowserOpen:true};
            },
            hideTrowserExample() {
                this.setState({trowserOpen:false});
            },
            render() {
                return <Trowser ref="trowser" visible={this.state.trowserOpen} onHide={this.hideTrowserExample}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        expect(TestUtils.isCompositeComponent(parent.refs.trowser)).toBeTruthy();

    });
});
