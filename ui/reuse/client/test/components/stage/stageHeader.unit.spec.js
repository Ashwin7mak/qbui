import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import StageHeader from '../../../src/components/stage/stageHeader';
import Icon from '../../../src/components/icon/icon';

const testTitle = 'Test Title';
const testIcon = 'testIcon';

let component;

describe('StageHeader', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a title', () => {
        component = shallow(<StageHeader title={testTitle}/>);

        expect(component.find('.stageHeaderTitle')).toHaveText(testTitle);
    });

    it('displays an icon', () => {
        component = shallow(<StageHeader title={testTitle} icon={testIcon} />);

        expect(component.find(Icon)).toHaveProp('icon', testIcon);
    });

    it('adds a custom class to the icon', () => {
        const testCustomIconClass = 'testClass';
        component = shallow(<StageHeader title={testTitle} icon={testIcon} iconClassName={testCustomIconClass} />);

        expect(component.find(Icon)).toHaveProp('className', testCustomIconClass);
    });

    it('displays a description', () => {
        const testDescription = <p className="testDescription">Test description</p>;
        component = shallow(<StageHeader title={testTitle} description={testDescription}/>);

        expect(component.find('.stageHeaderDescriptionContainer .testDescription')).toBePresent();
    });
});
