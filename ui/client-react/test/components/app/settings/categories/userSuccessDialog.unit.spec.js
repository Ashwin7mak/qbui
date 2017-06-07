import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import UserSuccessDialog, {__RewireAPI__ as UserSuccessDialogRewireAPI}  from '../../../../../src/components/app/settings/categories/userSuccessDialog';
import {shallow} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import WindowLocationUtils from '../../../../../src/utils/windowLocationUtils';

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
        render() {
            return (
				<UserSuccessDialog appUrl={appUrl}
					successDialogOpen={successDialogOpen}
					addedAppUser={addedAppUser}
					showSuccessDialog={mockParentFunctions.showSuccessDialog}/>
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
							showSuccessDialog={mockParentFunctions.showSuccessDialog}/>);

        expect(component.length).toEqual(1);
        expect(component.find('FieldValueEditor')).toBePresent();
        expect(component.find('MultiStepDialog')).toBePresent();
    });

    it('should call the showSuccessDialog function on click of finished', ()=>{
        spyOn(mockParentFunctions, 'showSuccessDialog');
        component = buildMockParentComponent();
        domComponent = document.querySelector('.userSuccessDialog');
        let cancelButton = domComponent.querySelector('.finishedText');

        Simulate.click(cancelButton);

        expect(mockParentFunctions.showSuccessDialog).toHaveBeenCalled();
    });

    it('should copy link', ()=>{
        let copy = {copy: ()=>{}};
        spyOn(copy, 'copy');
        UserSuccessDialogRewireAPI.__Rewire__('copy', copy.copy);
        component = buildMockParentComponent();
        domComponent = document.querySelector('.userSuccessDialog');
        let copyButton = domComponent.querySelector('.iconUISturdy-url');
        let url = WindowLocationUtils.getHref();
        url = url.substr(0, url.lastIndexOf('/'));

        Simulate.click(copyButton);

        expect(copy.copy).toHaveBeenCalledWith(url);
    });

    it('should have the correct email url', ()=>{
        component = buildMockParentComponent();
        domComponent = document.querySelector('.userSuccessDetails');
        let emailLink = domComponent.querySelector('a');

        expect(emailLink.href.includes('mailto:test@test.com?Subject=Link%20to%20the%20'));
    });
});
