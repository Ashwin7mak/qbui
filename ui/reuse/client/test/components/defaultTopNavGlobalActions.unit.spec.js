import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DefaultTopNavGlobalActions from '../../src/components/topNav/defaultTopNavGlobalActions';
import UserDropDown from '../../src/components/topNav/supportingComponents/userDropDown';
import ReHelpButton from '../../src/components/helpButton/helpButton';
import ReGlobalAction from '../../src/components/globalAction/globalAction';

let component;

describe('DefaultTopNavGlobalActions', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a user dropdown menu', () => {
        component = mount(<DefaultTopNavGlobalActions/>);

        expect(component.find(UserDropDown)).toBePresent();
    });

    it('has a help button', () => {
        component = mount(<DefaultTopNavGlobalActions/>);

        expect(component.find(ReHelpButton)).toBePresent();
    });

    it('can optionally display an array of global actions', () => {
        const testGlobalActions = [
            {icon: 'test1', msg: 'test1msg', link: 'test1link'},
            {icon: 'test2', msg: 'test2msg', link: 'test2link'},
        ];

        component = shallow(<DefaultTopNavGlobalActions actions={testGlobalActions} />);

        const renderedGlobalActions = component.find(ReGlobalAction);
        testGlobalActions.forEach((testAction, index) => {
            expect(renderedGlobalActions.at(index)).toHaveProp('action', testAction);
        });
    });

    it('can optionally display other child elements', () => {
        const testChildElement = <div className="testChildElement">Test Element</div>;

        component = shallow(<DefaultTopNavGlobalActions>{testChildElement}</DefaultTopNavGlobalActions>);

        expect(component.find('.testChildElement')).toBePresent();
    });
});
