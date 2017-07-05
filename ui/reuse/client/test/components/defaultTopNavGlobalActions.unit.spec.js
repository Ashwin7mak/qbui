import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import DefaultTopNavGlobalActions, {__RewireAPI__ as DefaultTopNavGlobalActionsRewireAPI} from 'REUSE/components/topNav/defaultTopNavGlobalActions';
import UserFeedBack from 'REUSE/components/topNav/supportingComponents/userFeedBack';
import HelpButton from 'REUSE/components/topNav/supportingComponents/helpButton';
import ReGlobalAction from 'REUSE/components/globalAction/globalAction';

let component;

describe('DefaultTopNavGlobalActions', () => {
    class UserDropDownMock extends React.Component {
        render() {
            return <div />;
        }
    }

    beforeEach(() => {
        jasmineEnzyme();
        DefaultTopNavGlobalActionsRewireAPI.__Rewire__('UserDropDown', UserDropDownMock);
    });

    afterEach(() => {
        DefaultTopNavGlobalActionsRewireAPI.__ResetDependency__('UserDropDown');
    });

    it('has a user dropdown menu', () => {
        component = shallow(<DefaultTopNavGlobalActions/>);
        expect(component.find('UserDropDownMock')).toBePresent();
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
        expect(component.find(UserDropDownMock)).toBePresent();
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
        component = shallow(<DefaultTopNavGlobalActions/>);

        expect(component.find(HelpButton)).toBePresent();
    });

    it('has a help button with a link prop if helpButtonLink is specified', () => {
        const url = `www.google.com`;
        component = shallow(<DefaultTopNavGlobalActions helpButtonLink={url}/>);
        expect(component.find(HelpButton)).toBePresent();
        expect(component.find(HelpButton)).toHaveProp('link', url);
    });
});
