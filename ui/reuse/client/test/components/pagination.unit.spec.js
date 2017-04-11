import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {I18nMessage} from '../../src/utils/i18nMessage'

const mockParentFunctions = {
  onClickPrevious() {},
  onClickNext() {},
};

import Pagination, {__RewireAPI__ as PaginationRewireAPI} from '../../src/components/pagination/pagination';

describe('Pagination component', () => {
  beforeEach(() => {
      jasmineEnzyme();
  });

  it('should render a `.reportNavigation` ', () => {
    const wrapper = mount(<Pagination isHidden={false} />);
    expect(wrapper.find(".reportNavigation")).toBePresent();
  });

  it('should render a `.pageNumbers` ', () => {
    const wrapper = mount(<Pagination isHidden={false} />);
    expect(wrapper.find(".pageNumbers")).toBePresent();
  });

  it('has a previous page button', () => {
    const wrapper = shallow(<Pagination />);
    wrapper.instance().previousPageButton();
  });
  //
  it('has a next page button', () => {
    const wrapper = shallow(<Pagination />);
    wrapper.instance().nextPageButton();
  });

  it('has a previous page button that can be clicked', () => {
  spyOn(mockParentFunctions, 'onClickPrevious');

  const component = mount(<Pagination isHidden={false} onClickPrevious={mockParentFunctions.onClickPrevious} />);

  component.find('.navigationButtonPrevious').simulate('click');
  expect(mockParentFunctions.onClickPrevious).toHaveBeenCalled();
  })

  it('has a next page button that can be clicked', () => {
  spyOn(mockParentFunctions, 'onClickNext');

  const component = mount(<Pagination isHidden={false} onClickNext={mockParentFunctions.onClickNext} />);

  component.find('.navigationButtonNext').simulate('click');
  expect(mockParentFunctions.onClickNext).toHaveBeenCalled();
  })

  it('has a previous page button that is disabled', () => {

  const wrapper = mount(<Pagination isHidden={false} isPreviousDisabled={true} />);

  wrapper.instance().previousPageButton();
  expect(wrapper.find('.previousButton .disabled')).toBePresent();
  })

  it('has a next page button that is disabled', () => {

  const wrapper = mount(<Pagination isHidden={false} isNextDisabled={true} />);

  wrapper.instance().nextPageButton();
  expect(wrapper.find('.nextButton .disabled')).toBePresent();
  })

  it('displays a message with page number', () => {
    const wrapper = mount(<Pagination isHidden={false} />);
    expect(wrapper.find(I18nMessage)).toHaveProp('message', 'report.reportNavigationBar');
  });
});
