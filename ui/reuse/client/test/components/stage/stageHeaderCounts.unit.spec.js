import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import StageHeaderCounts from '../../../src/components/stage/stageHeaderCounts';

const testItems = [
    {count: '1', title: 'first one'},
    {count: '2', title: 'second one'}
];

let component;

describe('StageHeaderCounts', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an empty array of items', () => {
        component = shallow(<StageHeaderCounts items={[]} />);

        expect(component.find('.stageHeaderCountItem')).not.toBePresent();
    });

    it('displays items with their count and title', () => {
        component = shallow(<StageHeaderCounts items={testItems} />);

        expect(component.find('.stageHeaderCountItem').length).toEqual(2);

        testItems.forEach((item, index) => {
            let renderedItem = component.find('.stageHeaderCountItem').at(index);

            expect(renderedItem.find('.stageHeaderCount')).toHaveText(item.count);
            expect(renderedItem.find('.stageHeaderCountTitle')).toHaveText(item.title);
        });
    });

    it('can have a custom class', () => {
        const testClass = 'testClass';
        component = shallow(<StageHeaderCounts items={testItems} className={testClass} />);

        expect(component.find(`.stageHeaderCounts.${testClass}`)).toBePresent();
        expect(component.find('.stageHeaderCounts.stageHeaderCountsWithIcon')).not.toBePresent();
    });

    it('can add spacing when there is an icon in the StageHeader component', () => {
        component = shallow(<StageHeaderCounts items={testItems} stageHeaderHasIcon={true} />);

        expect(component.find('.stageHeaderCounts.stageHeaderCountsWithIcon'));
    });
});
