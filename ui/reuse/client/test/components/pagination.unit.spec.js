import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Pagination, {__RewireAPI__ as PaginationRewireAPI} from '../../src/components/pagination/pagination';

describe('Pagination', () => {
  beforeEach(() => {
      jasmineEnzyme();
  });

  it('test next page button', () => {
    const mockNextPageButton = {nextPageButton() {}};
    spyOn(mockNextPageButton, 'nextPageButton');

    component = shallow(<Pagination nextPageButton={mockNextPageButton.onPageChange} />);

    expect(component.find('.nextPageButton')).toBePresent();
  })

  it('test previous page button', () => {
    const mockPreviousPageButton = {previousPageButton() {}};
    spyOn(mockPreviousPageButton, 'previousPageButton');

    component = shallow(<Pagination previousPageButton={mockPreviousPageButton.onPageChange} />);

    expect(component.find('.prevPageButton')).toBePresent();
  })

  it('test render of component with plain string', () => {
      let component = TestUtils.renderIntoDocument(<I18nMessage message="1"></I18nMessage>);
      expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
  });
})
