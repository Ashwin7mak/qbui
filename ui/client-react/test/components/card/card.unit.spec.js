import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import Card  from '../../../src/components/card/card';

describe('Card functions', () => {
    'use strict';

    const title = 'Users';
    const subtitle = 'Add/Remove Users in this app';
    const icon = 'users';
    const link = '/qbase/app/1/users';

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <Card
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    link={link}
                />
            </MemoryRouter>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test renderLink method with link', () => {
        let component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <Card
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    link={link}
                />
            </MemoryRouter>);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'cardLink').length).toEqual(1);
    });

    it('test renderLink method without link', () => {
        let component = shallow(
            <MemoryRouter>
                <Card
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                />
            </MemoryRouter>);
        const instance = component.dive().dive().instance();
        let result = instance.renderLink();
        expect(result).toEqual(title);
    });
});
