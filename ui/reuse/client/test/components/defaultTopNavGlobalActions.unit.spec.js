import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DefaultTopNavGlobalActions from 'REUSE/components/topNav/defaultTopNavGlobalActions';
import UserFeedBack from 'REUSE/components/topNav/supportingComponents/userFeedBack';
import HelpButton from 'REUSE/components/topNav/supportingComponents/helpButton';
import UserDropDown from 'REUSE/components/topNav/supportingComponents/userDropDown';
import ReGlobalAction from 'REUSE/components/globalAction/globalAction';

let component;

fdescribe('DefaultTopNavGlobalActions', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a user dropdown menu', () => {
        component = mount(<DefaultTopNavGlobalActions/>);

        expect(component.find(UserDropDown)).toBePresent();
    });

    it('renders the feedback button if hasFeedback is true', () => {
        component = shallow(<DefaultTopNavGlobalActions hasFeedback={true} />);

        expect(component.find(UserFeedBack)).toBePresent();
        expect(component.find(UserFeedBack)).toHaveProp('startTabIndex');
        expect(component.find(UserFeedBack)).toHaveProp('shouldOpenMenusUp');
    });

    it('does not render the feedback button if hasFeedback is false', () => {
        component = shallow(<DefaultTopNavGlobalActions hasFeedback={false} />);

        expect(component.find(UserFeedBack)).not.toBePresent();
        expect(component.find(UserDropDown)).toBePresent();
        expect(component.find(HelpButton)).toBePresent();
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

    it('has a help button', () => {
        component = mount(<DefaultTopNavGlobalActions/>);

        expect(component.find('.reHelpButton')).toBePresent();
    });
});
