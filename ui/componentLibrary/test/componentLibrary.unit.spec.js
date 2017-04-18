import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import ComponentLibraryWrapper from '../src/components/componentLibrary';
import PropTable from '../src/components/PropTable';
import ReactPlayground from '../src/components/ReactPlayground';
import {MemoryRouter} from 'react-router-dom';
import IconDoc from '../src/docs/icon';

const fakeMetadata = {
    "QBPanel": {
        "props": {
            "title": {
                "type": {
                    "name": "string"
                },
                "required": false,
                "desc": "the title to display in the Panel Header.",
                "defaultValue": "\"Untitled\"",
                "computed": false,
                "doclets": {},
                "descHtml": "<p>the title to display in the Panel Header.</p>\n"
            },
            "isOpen": {
                "type": {
                    "name": "bool"
                },
                "required": false,
                "desc": "boolean if we should start with the panel expanded or not",
                "defaultValue": "false",
                "computed": false,
                "doclets": {},
                "descHtml": "<p>boolean if we should start with the panel expanded or not</p>\n"
            },
            "panelNum": {
                "type": {
                    "name": "number"
                },
                "required": false,
                "desc": "creates a unique id for each panel object (helps with accessibility)",
                "doclets": {},
                "descHtml": "<p>creates a unique id for each panel object (helps with accessibility)</p>\n"
            },
            "iconRight": {
                "type": {
                    "name": "bool"
                },
                "required": false,
                "desc": "I guess the toggle icon is optional.",
                "defaultValue": "true",
                "computed": false,
                "doclets": {},
                "descHtml": "<p>I guess the toggle icon is optional.</p>\n"
            },
            "key": {
                "defaultValue": "-1",
                "computed": true,
                "doclets": {},
                "desc": "",
                "descHtml": ""
            }
        },
        "composes": [],
        "methods": {
            "toggleOpen": {}
        },
        "desc": "# QBPanel\n Custom QuickBase Panel component that wraps the bootstrap component. You can pass content by wrapping it in a `<QBPanel></QBPanel>` tag.",
        "doclets": {},
        "descHtml": "<h1 id=\"qbpanel\">QBPanel</h1>\n<p> Custom QuickBase Panel component that wraps the bootstrap component. You can pass content by wrapping it in a <code>&lt;QBPanel&gt;&lt;/QBPanel&gt;</code> tag.</p>\n"
    },
    "Icon": {
        "props": {
            "icon": {
                "type": {
                    "name": "string"
                },
                "required": true,
                "desc": "See QuickBase.design for full list of icons.",
                "doclets": {},
                "descHtml": "<p>See QuickBase.design for full list of icons.</p>\n"
            },
            "className": {
                "type": {
                    "name": "string"
                },
                "required": false,
                "desc": "",
                "defaultValue": "\"\"",
                "computed": false,
                "doclets": {},
                "descHtml": ""
            },
            "onClick": {
                "type": {
                    "name": "func"
                },
                "required": false,
                "desc": "",
                "doclets": {},
                "descHtml": ""
            }
        },
        "composes": [],
        "methods": {},
        "desc": "# QuickBase Icon Font\nAn icon using a new qb icon font (from Lisa)\n## Usage\n```\n  <Icon icon=\"accessibility\" />\n```",
        "doclets": {},
        "descHtml": "<h1 id=\"quickbase-icon-font\">QuickBase Icon Font</h1>\n<p>An icon using a new qb icon font (from Lisa)</p>\n<h2 id=\"usage\">Usage</h2>\n<pre><code>  &lt;Icon icon=&quot;accessibility&quot; /&gt;\n</code></pre>"
    }
};

const exampleCodeText = "const basicIcon = (<Icon icon='hamburger' />);ReactDOM.render(basicIcon, mountNode);";

describe('Component Library functions', () => {
    'use strict';

    it('test render component library wrapper', () => {
        let component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <ComponentLibraryWrapper/>
            </MemoryRouter>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    // ReactPlayground
    it('test render react playground', () => {
        let component = TestUtils.renderIntoDocument(<ReactPlayground codeText={exampleCodeText} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('code editor should show', () => {
        let component = TestUtils.renderIntoDocument(<ReactPlayground codeText={exampleCodeText} showCode={false} />);

        const codeToggler = ReactDOM.findDOMNode(component).querySelector(".code-toggle");
        TestUtils.Simulate.click(codeToggler);

        const codeEditor = TestUtils.findRenderedDOMComponentWithClass(component, 'highlight');
        expect(codeEditor).toBeTruthy();
    });

    // it('code editor should bail on bad code', () => {
    // });

    // Router
    // it('router default should be QBPanel', () => {
    // });

    // PropTable
    it('test render prop table', () => {
        let component = TestUtils.renderIntoDocument(<PropTable component="Icon" metadata={fakeMetadata} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    // Test doc files
    // it('test render Icon Doc', () => {
    //     var component = TestUtils.renderIntoDocument(<IconDoc />);
    //     expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    // });

});
