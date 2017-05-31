import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import UserSuccessDialog from '../../../../../src/components/app/settings/categories/userSuccessDialog';
import {shallow} from 'enzyme';

let component;
const successDialogOpen = true;
const addedAppUser = "test@test.com";
const appUrl = "testurl.com";

const mockParentFunctions = {
    showSuccessDialog(status) {},
};

describe('showSuccessDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders the component', ()=>{
        spyOn(mockParentFunctions, 'showSuccessDialog');
        component = shallow(<UserSuccessDialog appUrl={appUrl}
							successDialogOpen={successDialogOpen}
							addedAppUser={addedAppUser}
							showSuccessDialog={mockParentFunctions.showSuccessDialog}
		/>);
        component.instance().onClickCopy();
        expect(component.length).toEqual(1);
    });

    it('runs onFinished method', ()=>{
        spyOn(mockParentFunctions, 'showSuccessDialog');
        component = shallow(<UserSuccessDialog appUrl={appUrl}
								successDialogOpen={successDialogOpen}
								addedAppUser={addedAppUser}
								showSuccessDialog={mockParentFunctions.showSuccessDialog}
							/>);
        expect(component.length).toEqual(1);
        component.instance().onFinished();
        expect(mockParentFunctions.showSuccessDialog).toHaveBeenCalled();
    });
});
