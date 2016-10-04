import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import UrlFieldValueRenderer from '../../src/components/fields/urlFieldValueRenderer';

describe('UrlFieldValueRenderer', () => {
    let component, domComponent;
    let alternateText = 'Click Me!';
    let urlWithProtocol = 'http://www.quickbase.com/';
    let urlWithoutProtocol = 'www.quickbase.com/';
    let urlWithSpecialCharacters = 'http://www.quickbase.com?javascript: function() { alert("hello!") }';
    let expectedEncodedUrl = 'http://www.quickbase.com/?javascript:%20function()%20%7B%20alert(%22hello!%22)%20%7D';
    let telephoneNumber = 'tel:555-555-5555';

    it('displays a url as a clickable link by default', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol} display={urlWithProtocol} />);
        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        expect(domComponent.href).toEqual(urlWithProtocol);
        expect(domComponent.text).toEqual(urlWithProtocol);
    });

    it('opens in a new window by default', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol} display={urlWithProtocol} />);
        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        expect(domComponent.target).toEqual('_blank');
    });

    it('can open a link in the same window', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol}
                                                                        display={urlWithProtocol}
                                                                        openInNewWindow={false} />);
        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        expect(domComponent.target).toEqual('_self');
    });

    it('displays only text if disabled', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol}
                                                                        display={urlWithProtocol}
                                                                        disabled={true} />);
        domComponent = ReactDOM.findDOMNode(component);
        let aTag = domComponent.querySelector('a');
        let spanTag = domComponent.querySelector('span');

        expect(aTag).toEqual(null);
        expect(spanTag.textContent).toEqual(urlWithProtocol);
    });

    it('can display the link as a button', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol}
                                                                        display={urlWithProtocol}
                                                                        showAsButton={true} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('a');

        expect(domComponent.classList).toContain('btn');
    });

    it('can display the link as a disabled button', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol}
                                                                        display={urlWithProtocol}
                                                                        showAsButton={true}
                                                                        disabled={true} />);

        domComponent = ReactDOM.findDOMNode(component);
        let aTag = domComponent.querySelector('a');
        let spanTag = domComponent.querySelector('span');

        expect(aTag).toEqual(null);
        expect(spanTag.classList).toContain('btn');
        expect(spanTag.classList).toContain('disabled');
    });

    it('will not display an empty button (i.e., a button without text)', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol}
                                                                        display={null}
                                                                        showAsButton={true} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('span');
        expect(domComponent.textContent).toEqual('');
    });

    it('adds a protocol to the url if one is missing', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithoutProtocol}
                                                                        display={urlWithoutProtocol} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('a');

        expect(domComponent.href).toEqual(urlWithProtocol);
        expect(domComponent.textContent).toEqual(urlWithProtocol);
    });

    it("will not add a protocol to the displayed text if the text is something besides a url (i.e., we don't want http:\\Click Me)", () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithoutProtocol}
                                                                        display={alternateText} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('a');

        expect(domComponent.href).toEqual(urlWithProtocol);
        expect(domComponent.textContent).toEqual(alternateText);
    });

    it('displays alternate text for the link', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithProtocol}
                                                                        display={alternateText} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('a');

        expect(domComponent.href).toEqual(urlWithProtocol);
        expect(domComponent.textContent).toEqual(alternateText);
    });

    it('displays an icon for special protocols such as tel, email, and sms', () => {
        // Tests for determining specific icons is in utils/urlUtils.unit.spec.js
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={telephoneNumber}
                                                                        display={telephoneNumber} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('.qbIcon');

        expect(domComponent).not.toEqual(null);
    });

    it('encodes urls', () => {
        component = TestUtils.renderIntoDocument(<UrlFieldValueRenderer value={urlWithSpecialCharacters}
                                                                        display={urlWithSpecialCharacters} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('a');

        expect(domComponent.href).toEqual(expectedEncodedUrl);
    });
});
