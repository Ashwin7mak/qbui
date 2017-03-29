import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import StandardLeftNav from '../../src/components/sideNavs/standardLeftNav';

let component;

const testNavItems = [
    {title: 'Back to My Apps', isPrimaryAction: true, secondaryIcon: 'caret-left', href: '/qbase/apps'},
    {icon: 'Report', title: 'Account summary', isDisabled: true},
    {icon: 'favicon', title: 'Manage apps', isDisabled: true},
    {icon: 'users', title: 'Manage users', isSelected: true},
    {icon: 'Group', title: 'Manage groups', isDisabled: true},
    {icon: 'configure', title: 'Set account properties', isDisabled: true},
    {icon: 'selected', title: 'Set realm policies', isDisabled: true},
    {icon: 'Fountain_Pen', title: 'Edit realm branding', isDisabled: true},
    {icon: 'currency', title: 'Manage billing', isDisabled: true},
    {icon: 'bell', title: 'Contact support'}
];

describe('StandardLeftNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a list of navItems', () => {
        component = mount(<StandardLeftNav navItems={testNavItems}/>);

        expect(component.find('.standardLeftNavItemsList .simpleNavItem').length).toEqual(testNavItems.length - 1); // subtract one to account for single primary action
    });

    it('displays primary actions at the top', () => {
        component = mount(<StandardLeftNav navItems={testNavItems}/>);

        expect(component.find('.standardLeftNavPrimaryActions .primaryAction').length).toEqual(1); // subtract one to account for single primary action
    });

    it('optionally has a context header', () => {
        const testTitle = 'Test Context Header';
        component = mount(<StandardLeftNav contextHeaderTitle={testTitle} />);

        expect(component.find('.contextHeaderTitle')).toHaveText(testTitle);
    });

    it('has an area for branding', () => {
        component = mount(<StandardLeftNav/>);

        expect(component.find('.standardLeftNavBranding')).toBePresent();
    });

    it('displays a loading indicator', () => {
        component = mount(<StandardLeftNav showLoadingIndicator={true}/>);

        expect(component.find('.loader')).toBePresent();
        expect(component.find('.standardLeftNavItemsList')).not.toBePresent();
    });

    it('can be displayed in a collapsed state', () => {
        component = mount(<StandardLeftNav isCollapsed={true}/>);

        expect(component.find('.isCollapsedStandardLeftNav')).toBePresent();
    });
});
