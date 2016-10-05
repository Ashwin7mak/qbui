import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import RecordTrowser from '../../src/components/record/recordTrowser';

const RecordMock = React.createClass({
    render: function() {
        return (
            <div className="record">test</div>
        );
    }
});

describe('RecordTrowser functions', () => {
    'use strict';

    let flux = {
        actions: {

        }
    };

    let component;

    beforeEach(() => {
        RecordTrowser.__Rewire__('Record', RecordMock);
    });

    afterEach(() => {
        RecordTrowser.__ResetDependency__('Record');
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser flux={flux} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();


    });
});
