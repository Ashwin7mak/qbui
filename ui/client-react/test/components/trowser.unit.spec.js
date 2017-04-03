import React from 'react';

import Trowser  from '../../src/components/trowser/trowser';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import TestUtils from 'react-addons-test-utils';

const mockParentProps = {
    onCancel() {},
};

describe('Trowser functions', () => {
    'use strict';
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockParentProps, 'onCancel');
    });

    var component;

    it('test render of visible trowser', () => {
        component = TestUtils.renderIntoDocument(<Trowser visible={true} content={<div/>} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of invisible trowser', () => {
        component = TestUtils.renderIntoDocument(<Trowser visible={false} content={<div/>} />);
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
                return <Trowser ref="trowser" content={<div/>} visible={this.state.trowserOpen} onHide={this.hideTrowserExample}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        expect(TestUtils.isCompositeComponent(parent.refs.trowser)).toBeTruthy();

    });

    it('keyboardOnCancel will cancel if the trowser is visible', () => {
        component = shallow(<Trowser ref="trowser" content={<div/>} visible={true} onCancel={mockParentProps.onCancel}/>);

        let instance = component.instance();
        instance.keyboardOnCancel();

        expect(mockParentProps.onCancel).toHaveBeenCalled();

    });

    it('keyboardOnCancel will not cancel if the trowser is not visible', () => {
        component = shallow(<Trowser ref="trowser" content={<div/>} visible={false} onCancel={mockParentProps.onCancel}/>);

        let instance = component.instance();
        instance.keyboardOnCancel();

        expect(mockParentProps.onCancel).not.toHaveBeenCalled();

    });
});
