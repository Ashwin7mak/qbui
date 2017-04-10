import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

const I18nMessageMock = ({message}) => <span className="mockI18nMessage">{message}</span>;

import Pagination, {__RewireAPI__ as PaginationRewireAPI} from '../../src/components/pagination/pagination';

const mockParentFunctions = {
  onChange() {},
};

describe('Pagination component', () => {
  beforeEach(() => {
      jasmineEnzyme();
      PaginationRewireAPI.__Rewire__('I18nMessage', ({message}) => <div className="mockMessage">{message}</div>);
  });

  afterEach(() => {
    PaginationRewireAPI.__ResetDependency__('I18nMessage');
  });

  it('should render a `.reportNavigation` ', () => {
    const wrapper = mount(<Pagination pagingData={true}/>);
    expect(wrapper.find(".reportNavigation")).toBePresent();
  });

  it('should render a `.pageNumbers` ', () => {
    const wrapper = mount(<Pagination pagingData={true}/>);
    expect(wrapper.find(".pageNumbers")).toBePresent();
  });

  it('has a previous page button', () => {
    const wrapper = shallow(<Pagination />);
    wrapper.instance().previousPageButton();
  });

  it('has a next page button', () => {
    const wrapper = shallow(<Pagination />);
    wrapper.instance().nextPageButton();
  });

  it('has a previous page button that can be clicked', () => {
  spyOn(mockParentFunctions, 'onChange');

  const component = mount(<Pagination pagingData={true} current={3} total={1000} onChange={mockParentFunctions.onChange}/>);
  let instance = component.instance();
  spyOn(instance, '_prev');

  component.find('.navigationButtonPrevious').simulate('click');
  expect(mockParentFunctions.onChange).toHaveBeenCalledWith(2,20);
  })

  it('has a next page button that can be clicked', () => {
    spyOn(mockParentFunctions, 'onChange');

  const component = mount(<Pagination pagingData={true} total={1000} onChange={mockParentFunctions.onChange}/>);
  let instance = component.instance();
  spyOn(instance, '_next');

  component.find('.navigationButtonNext').simulate('click');
  expect(mockParentFunctions.onChange).toHaveBeenCalledWith(2,20);
  })

  it('displays a message with page number', () => {
    const component = mount(<Pagination pagingData={true}/>);
    expect(component.find('.mockMessage')).toHaveText("report.reportNavigationBar");
  });
})
