import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import UserSuccessDialog from '../../../../../src/components/app/settings/categories/userSuccessDialog';
import {shallow} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

let component;
let domComponent;
const successDialogOpen = true;
const addedAppUser = "test@test.com";
const appUrl = "testurl.com";

const mockParentFunctions = {
    showSuccessDialog(status) {},
};

function buildMockParent() {
    return React.createClass({
        getInitialState() {
            return {
                pageIndex: 0
            };
        },
        render() {
            return (
				<UserSuccessDialog appUrl={appUrl}
					successDialogOpen={successDialogOpen}
					addedAppUser={addedAppUser}
					showSuccessDialog={mockParentFunctions.showSuccessDialog}
				/>
            );
        }
    });
}

function buildMockParentComponent(options) {
    return TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
}

describe('showSuccessDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
		// Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.userSuccessDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('renders the component', ()=>{
        spyOn(mockParentFunctions, 'showSuccessDialog');
        component = shallow(<UserSuccessDialog
							successDialogOpen={successDialogOpen}
							addedAppUser={addedAppUser}
							showSuccessDialog={mockParentFunctions.showSuccessDialog}
		/>);
        expect(component.length).toEqual(1);
        expect(component.find('FieldValueEditor').length).toEqual(1);
		expect(component.find('MultiStepDialog').length).toEqual(1);
    });

    it('should call the showSuccessDialog function on click of finished', ()=>{
        spyOn(mockParentFunctions, 'showSuccessDialog');
        component = buildMockParentComponent();
        domComponent = document.querySelector('.userSuccessDialog');
        let cancelButton = domComponent.querySelector('.finishedText');
        Simulate.click(cancelButton);
        expect(mockParentFunctions.showSuccessDialog).toHaveBeenCalled();
    });

});
