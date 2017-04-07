import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Pagination, {__RewireAPI__ as PaginationRewireAPI} from '../../src/components/pagination/pagination';

let component;

fdescribe('Pagination component', () => {
  beforeEach(() => {
      jasmineEnzyme();
  });

  fit('has a next page button', () => {
    const mockNextPageButton = {nextPageButton() {}};
    spyOn(mockNextPageButton, 'nextPageButton');

    component = shallow(<Pagination page={1} pageCount={20} nextPageButton={mockNextPageButton.onPageChange} />);

    let mockNextPageButtonSimulate = component.find('.nextPageButton');
    expect(mockNextPageButtonSimulate).toBePresent();


    //expect(component.find(nextButtonClassName).toContain(disabled));
  })

  fit('has a previous page button', () => {
    const mockPreviousPageButton = {previousPageButton() {}};
    spyOn(mockPreviousPageButton, 'previousPageButton');

    component = shallow(<Pagination previousPageButton={mockPreviousPageButton.onPageChange} />);

    let instance = component.instance();
        spyOn(instance, 'previousPageButton').and.returnValue('.prevPageButton');
  })

  it('that fetches a previous page when previousPageButton is clicked', () => {
      const testParent = {testOnClick() {}};
      spyOn(testParent, 'testOnClick');
      component = shallow(<Pagination onPageChange={testParent.testOnClick}/>);

      component.find('.navigationButtonPrevious').simulate('click');

      expect(testParent.testOnClick).toHaveBeenCalledWith(page-1);
  });

  it('that fetches a next page when nextPageButton is clicked', () => {
      const testParent = {testOnClick() {}};
      spyOn(testParent, 'testOnClick');
      component = shallow(<Pagination onPageChange={testParent.testOnClick}/>);

      component.find('.navigationButtonNext').simulate('click');

      expect(testParent.testOnClick).toHaveBeenCalledWith(page+1);
  });
})
