import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Pagination, {__RewireAPI__ as PaginationRewireAPI} from '../../src/components/pagination/pagination';

let component;

fdescribe('Pagination component', () => {
  beforeEach(() => {
      jasmineEnzyme();
  });

  it('has a next page button', () => {
    const mockNextPageButton = {nextPageButton() {}};
    spyOn(mockNextPageButton, 'nextPageButton');

    component = shallow(<Pagination nextPageButton={mockNextPageButton._next} />);

    let instance = component.instance();
        spyOn(instance, 'nextPageButton').and.returnValue('.nextPageButton');
  })

  it('has a previous page button', () => {
    const mockPreviousPageButton = {previousPageButton() {}};
    spyOn(mockPreviousPageButton, 'previousPageButton');

    component = shallow(<Pagination previousPageButton={mockPreviousPageButton._prev} />);

    let instance = component.instance();
        spyOn(instance, 'previousPageButton').and.returnValue('.prevPageButton');
  })

  // fit('that fetches a previous page when previousPageButton is clicked', () => {
  //     const testParent = {testOnClick() {}};
  //     spyOn(testParent, 'testOnClick');
  //     component = shallow(<Pagination page={2} onPageChange={testParent.testOnClick}/>);
  //
  //     component.find('.navigationButtonPrevious').simulate('click');
  //
  //     expect(testParent.testOnClick).toHaveBeenCalledWith(page-1);
  // });
  //
  // fit('that fetches a next page when nextPageButton is clicked', () => {
  //     const testParent = {testOnClick() {}};
  //     spyOn(testParent, 'testOnClick');
  //     component = shallow(<Pagination onPageChange={testParent.testOnClick}/>);
  //
  //     component.find('.navigationButtonNext').simulate('click');
  //
  //     expect(testParent.testOnClick).toHaveBeenCalledWith(page+1);
  // });
})
