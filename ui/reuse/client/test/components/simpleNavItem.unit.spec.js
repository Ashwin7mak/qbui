import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import SimpleNavItem from '../../src/components/simpleNavItem/simpleNavItem';
import {Link} from 'react-router';

let component;

describe('SimpleNavItem', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders the nav item as a react-router link if the link prop is passed in', () => {
        const testLink = '/qbase/apps';
        component = shallow(<SimpleNavItem link={testLink} />);

        expect(component.find(Link)).toBePresent();
        expect(component.find(Link)).toHaveProp('to', testLink);
    });

    it('renders the nav items with a click handler if onClick is passed in', () => {
        const testParent = {testOnClick() {}};
        spyOn(testParent, 'testOnClick');
        component = shallow(<SimpleNavItem onClick={testParent.testOnClick}/>);

        component.find('.simpleNavItem').simulate('click');

        expect(testParent.testOnClick).toHaveBeenCalled();
    });

    it('renders the nav item with an href if href is passed in', () => {
        const testHref = '/qbase/test';
        component = shallow(<SimpleNavItem href={testHref}/>);

        expect(component.find('.simpleNavItem')).toHaveProp('href', testHref);
    });

    it('can be selected', () => {
        component = shallow(<SimpleNavItem isSelected={true} />);

        expect(component.find('.navItemSelected')).toBePresent();
        expect(component.find('.navItemDisabled')).not.toBePresent();
        expect(component.find('.navItemPrimaryAction')).not.toBePresent();
    });

    it('can be disabled', () => {
        component = shallow(<SimpleNavItem isDisabled={true} />);

        expect(component.find('.navItemDisabled')).toBePresent();
        expect(component.find('.navItemSelected')).not.toBePresent();
        expect(component.find('.navItemPrimaryAction')).not.toBePresent();
    });

    it('can be styled as a primary action', () => {
        component = shallow(<SimpleNavItem isPrimaryAction={true} />);

        expect(component.find('.navItemPrimaryAction')).toBePresent();
        expect(component.find('.navItemSelected')).not.toBePresent();
        expect(component.find('.navItemDisabled')).not.toBePresent();
    });

    it('has a title', () => {
        const testTitle = 'test title';
        component = shallow(<SimpleNavItem title={testTitle} />);

        expect(component).toIncludeText(testTitle);
    });
});
