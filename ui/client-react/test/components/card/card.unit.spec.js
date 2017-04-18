import React from 'react';
import {shallow, mount} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import createRouterContext from 'react-router-test-context';
import Card  from '../../../src/components/card/card';

describe('Card functions', () => {
    'use strict';

    const title = 'Users';
    const subtitle = 'Add/Remove Users in this app';
    const icon = 'users';
    const link = '/qbase/app/1/users';

    it('test render of component', () => {
        let component = shallow(
            <Card
                title={title}
                subtitle={subtitle}
                icon={icon}
                link={link}
            />);
        expect(component.exists()).toBeTruthy();
    });

    it('test renderLink method with link', () => {
        const context = createRouterContext();
        let component = mount(
            <Card
                title={title}
                subtitle={subtitle}
                icon={icon}
                link={link}
            />,
            {context});
        expect(component.find('.cardLink').length).toEqual(1);
    });

    it('test renderLink method without link', () => {
        let component = shallow(
            <Card
                title={title}
                subtitle={subtitle}
                icon={icon}
            />);
        const instance = component.instance();
        let result = instance.renderLink();
        expect(result).toEqual(title);
    });
});
