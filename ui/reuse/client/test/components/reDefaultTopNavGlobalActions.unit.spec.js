import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReDefaultTopNavGlobalActions from '../../src/components/reTopNav/reDefaultTopNavGlobalActions';
import UserDropDown from '../../src/components/reTopNav/supportingComponents/userDropDown';
import ReHelpButton from '../../src/components/reHelpButton/reHelpButton';
import ReGlobalAction from '../../src/components/reGlobalAction/reGlobalAction';

let component;

describe('ReDefaultTopNavGlobalActions', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a user dropdown menu', () => {
        component = mount(<ReDefaultTopNavGlobalActions/>);

        expect(component.find(UserDropDown)).toBePresent();
    });

    it('has a help button', () => {
        component = mount(<ReDefaultTopNavGlobalActions/>);

        expect(component.find(ReHelpButton)).toBePresent();
    });

    it('can optionally display an array of global actions', () => {
        const testGlobalActions = [
            {icon: 'test1', msg: 'test1msg', link: 'test1link'},
            {icon: 'test2', msg: 'test2msg', link: 'test2link'},
        ];

        component = shallow(<ReDefaultTopNavGlobalActions actions={testGlobalActions} />);

        const renderedGlobalActions = component.find(ReGlobalAction);
        testGlobalActions.forEach((testAction, index) => {
            expect(renderedGlobalActions.at(index)).toHaveProp('action', testAction);
        });
    });

    it('can optionally display other child elements', () => {
        const testChildElement = <div className="testChildElement">Test Element</div>;

        component = shallow(<ReDefaultTopNavGlobalActions>{testChildElement}</ReDefaultTopNavGlobalActions>);

        expect(component.find('.testChildElement')).toBePresent();
    });
});
