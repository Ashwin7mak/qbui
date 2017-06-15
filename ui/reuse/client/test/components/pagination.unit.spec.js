import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {I18nMessage} from 'REUSE/utils/i18nMessage';

const mockParentFunctions = {
    onClickPrevious() {},
    onClickNext() {},
};

import Pagination, {__RewireAPI__ as PaginationRewireAPI} from 'REUSE/components/pagination/pagination';

describe('Pagination ', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a previous page button that can be clicked', () => {
        spyOn(mockParentFunctions, 'onClickPrevious');
        const component = mount(<Pagination isHidden={false} isPreviousDisabled={false} onClickPrevious={mockParentFunctions.onClickPrevious} />);

        component.find('.navigationButtonPrevious').simulate('click');

        expect(mockParentFunctions.onClickPrevious).toHaveBeenCalled();
        expect(component.find('.previousButton')).toBePresent();
        expect(component.find('.previousButton .disabled')).not.toBePresent();

    });

    it('has a next page button that can be clicked', () => {
        spyOn(mockParentFunctions, 'onClickNext');
        const component = mount(<Pagination isHidden={false} isNextDisabled={false} onClickNext={mockParentFunctions.onClickNext} />);

        component.find('.navigationButtonNext').simulate('click');

        expect(mockParentFunctions.onClickNext).toHaveBeenCalled();
        expect(component.find('.nextButton')).toBePresent();
        expect(component.find('.nextButton .disabled')).not.toBePresent();

    });

    it('has a previous page button that is disabled', () => {
        const wrapper = mount(<Pagination isHidden={false} isPreviousDisabled={true} />);

        expect(wrapper.find('.previousButton .disabled')).toBePresent();
    });

    it('has a next page button that is disabled', () => {
        const wrapper = mount(<Pagination isHidden={false} isNextDisabled={true} />);

        expect(wrapper.find('.nextButton .disabled')).toBePresent();
    });

    it('displays a message with page number', () => {
        let startRecord = 1;
        let endRecord = 20;
        const wrapper = mount(<Pagination isHidden={false} startRecord={startRecord} endRecord={endRecord}/>);
        expect(wrapper.find(I18nMessage)).toHaveProp('message', 'report.reportNavigationBar');
        expect(wrapper.find(I18nMessage)).toHaveProp('pageStart', 1);
        expect(wrapper.find(I18nMessage)).toHaveProp('pageEnd', 20);

    });
});
