import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import RoleDropdown from '../../src/components/app/roleDropdown';
import {shallow} from 'enzyme';

let component;

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

});
