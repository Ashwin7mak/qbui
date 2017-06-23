import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import RoleDropdown from '../../src/components/app/roleDropdown';
import {shallow} from 'enzyme';
import Locale from 'REUSE/locales/locale';

let component;
const title = Locale.getMessage('app.users.assignRole')
const mockParentFunctions = {
    getRoles: ()=>{},
    updateRole: ()=>{}
};

describe('RoleDropdown', () => {
    beforeEach(() => {
        jasmineEnzyme();
        component = shallow(<RoleDropdown
			autofocus
			titleClass="role-dropdown-title"
			options={mockParentFunctions.getRoles}
			searchable={false}
			simpleValue
			clearable={false}
			value={1}
			onChange={mockParentFunctions.updateRole}
			title={"app.users.assignRole"}
		/>);
    });

    it('should render the component', ()=>{
        expect(component.length).toEqual(1);
    });

    it('should have the select component ', ()=>{
        expect(component.find('Select').length).toEqual(1);
    });

    it('should correctly render the title ', ()=>{
        expect(component.find('.role-dropdown-title').html().includes(title));
    });

});
