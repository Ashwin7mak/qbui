import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import V2V3Footer  from '../../src/components/footer/v2v3Footer';

describe('V2V3Footer functions', () => {
    'use strict';

    let component;

    let flux = {
    };

    it('test render of default V2V3Footer component, openInV3=false', () => {

        const app = {
            openInV3: false
        }

        component = TestUtils.renderIntoDocument(<V2V3Footer flux={flux} app={app} onSelectOpenInV3={()=>{}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of default V2V3Footer component, openInV3=true', () => {

        const app = {
            openInV3: true
        }

        component = TestUtils.renderIntoDocument(<V2V3Footer flux={flux} app={app} onSelectOpenInV3={()=>{}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const node = ReactDOM.findDOMNode(component);
        const classicCheckbox = node.querySelector(".openInClassic input");

        expect(classicCheckbox.value).toBe("false");
    });

    it('test render of default V2V3Footer component, toggle selection', () => {

        const app = {
            openInV3: true
        }

        component = TestUtils.renderIntoDocument(<V2V3Footer flux={flux} app={app} onSelectOpenInV3={(v3)=>{app.openInV3 = v3;}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const node = ReactDOM.findDOMNode(component);
        const mercuryCheckbox = node.querySelector(".openInMercury input");
        const classicCheckbox = node.querySelector(".openInClassic input");

        expect(mercuryCheckbox.value).toBe("true");

        TestUtils.Simulate.change(classicCheckbox, {"target": {"checked": true}});

        expect(app.openInV3).toBe(false);

    });
});
