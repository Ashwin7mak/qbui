import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Card  from '../../../src/components/card/card';

describe('Card functions', () => {
    'use strict';

    const title = 'Users';
    const subtitle = 'Add/Remove Users in this app';
    const icon = 'users';
    const link = '/qbase/app/1/users';

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<Card title={title}
                                                                        subtitle={subtitle}
                                                                        icon={icon}
                                                                        link={link}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test renderLink method with link', () => {
        let component = TestUtils.renderIntoDocument(<Card title={title}
                                                                       subtitle={subtitle}
                                                                       icon={icon}
                                                                       link={link}/>);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'cardLink').length).toEqual(1);
    });

    it('test renderLink method without link', () => {
        let component = TestUtils.renderIntoDocument(<Card title={title}
                                                                       subtitle={subtitle}
                                                                       icon={icon}/>);
        let result = component.renderLink();
        expect(result).toEqual(title);
    });
});
