import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import UrlFieldValueEditor from '../../src/components/fields/urlFieldValueEditor';

describe('UrlFieldValueEditor', () => {
    let component;
    let placeholderText = 'www.example.com'; // Specified in https://quickbase.atlassian.net/wiki/display/qbasepd/Error+messages
    let testUrl = 'www.google.com';
    let testUrlWithProtocol = 'http://www.google.com';
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
        onBlur(updatedValueObject) {
            this.setState(updatedValueObject);
        },
        render() {
            return (
                <UrlFieldValueEditor value={this.state.value}
                                     display={this.state.display}
                                     onChange={this.onChange}
                                     onBlur={this.onBlur}
                                     fieldDef={{datatypeAttributes: {displayProtocol: false}}}/>
            );
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

    it('formats the url for display onBlur', () => {
        component = TestUtils.renderIntoDocument(<MockParent />);
        component.setState({value: testUrl, display: ''});

        let input = ReactDOM.findDOMNode(component);

        Simulate.blur(input, {
            value: testUrlWithProtocol
        });

        expect(component.state.display).toEqual(testUrl);
    });
});
