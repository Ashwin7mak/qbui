import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Stage from '../../src/components/stage/stage';

let component;

describe('Stage', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a headline', () => {
        const testHeadline = <h3 className="testHeadline">Test Headline</h3>;
        component = shallow(<Stage stageHeadline={testHeadline} />);

        let renderedHeader = component.find('.stageHeader .testHeadline');

        expect(renderedHeader).toBePresent();
        expect(renderedHeader).toHaveText('Test Headline');
    });

    it('displays page actions', () => {
        const testPageActions = <button className="testAction">Test Action</button>;
        component = shallow(<Stage pageActions={testPageActions} />);

        expect(component.find('.pageActions .testAction')).toBePresent();
    });

    it('renders children in a collapsible panel', () => {
        const testContent = <p className="testContent">Test Content</p>;
        component = mount(<Stage>{testContent}</Stage>);

        expect(component.find('.collapsedContent .testContent')).toBePresent();
    });
});
