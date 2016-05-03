import React from 'react';

import ReactDOM from 'react-dom';
import SortAndGroup  from '../../src/components/sortGroup/sortAndGroup';

import TestUtils from 'react-addons-test-utils';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

var SortAndGroupDialogMock = React.createClass({
    render: function() {
        return (
            <div>SortAndGroupDialogMock</div>
        );
    }
});

describe('SortAndGroup functions', () => {
    'use strict';

    var component;
    let flux = {
    };
    beforeEach(() => {
        SortAndGroup.__Rewire__('I18nMessage', I18nMessageMock);
        SortAndGroup.__Rewire__('SortAndGroupDialog', SortAndGroupDialogMock);
    });

    afterEach(() => {
        SortAndGroup.__ResetDependency__('I18nMessage');
        SortAndGroup.__ResetDependency__('SortAndGroupDialog');
    });

    it('test render of not visible SortAndGroup', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} show={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of visible SortAndGroup', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.setState({show: true});
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test click sortButtonSpan button', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
        let sortButtonSpan = TestUtils.scryRenderedDOMComponentsWithClass(component, "sortButtonSpan");
        expect(sortButtonSpan.length).toEqual(1);
        TestUtils.Simulate.click(sortButtonSpan[0]);
        expect(component.state.show).toBeTruthy();
        TestUtils.Simulate.click(sortButtonSpan[0]);
        expect(component.state.show).toBeFalsy();
    })

});
