import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import UrlFieldValueEditor from '../../src/components/fields/urlFieldValueEditor';

describe('UrlFieldValueEditor', () => {
    let component;
    let placeholderText = 'www.example.com'; // Specified in https://quickbase.atlassian.net/wiki/display/qbasepd/Error+messages
    let testUrl = 'www.google.com';
    let testDisplayUrl = "Don't edit me";

    let MockParent = React.createClass({
        getInitialState() {
            return {
                url: null,
                displayUrl: testDisplayUrl
            };
        },
        onChange(newValue) {
            this.setState({url: newValue});
        },
        render() {
            return <UrlFieldValueEditor value={this.state.value} display={this.state.displayUrl} onChange={this.onChange} />;
        }
    });

    it('allows a user to edit the raw value of a url', () => {
        component = TestUtils.renderIntoDocument(<MockParent />);
        let domComponent = ReactDOM.findDOMNode(component);

        Simulate.change(domComponent, {
            target: {value: testUrl}
        });

        expect(component.state.url).toEqual(testUrl);
        expect(component.state.displayUrl).toEqual(testDisplayUrl);
    });

    it('has placeholder text', () => {
        component = TestUtils.renderIntoDocument(<MockParent />);
        let domComponent = ReactDOM.findDOMNode(component);

        expect(domComponent.placeholder).toEqual(placeholderText);
    });
});
