import React, {PropTypes} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import QbRow from '../../../src/components/dataTable/qbGrid/qbRow';

let component;
const rowId = 1;

describe('qbRow', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    const testProps = {
        rowId: rowId,
        numberOfColumns: null,
        isSubHeader: false,
        subHeaderId: null,
        subHeaderLabel: null,
        subHeaderLevel: null,
    };

    const subHeaderId = 'testSubHeaderId';
    const subHeaderLabel = 'This is a subheader';
    const subHeaderLevel = 2;
    const subHeaderProps = Object.assign({}, testProps, {
        subHeaderId: subHeaderId,
        isSubHeader: true,
        subHeaderLabel: subHeaderLabel,
        subHeaderLevel: subHeaderLevel,
        toggleCollapseGroup() {}
    });

    it('renders a table row with a key based on the rowId', () => {
        component = shallow(<QbRow {...testProps} />);

        let row = component.find('tr');

        expect(row.key()).toEqual(`qbRow-${rowId}`);
        expect(component.find('td')).toBeEmpty();
    });

    it('renders a subheader row isSubHeader is true', () => {
        component = shallow(<QbRow {...subHeaderProps}/>);

        expect(component.find('.subHeaderLabel')).toHaveText(subHeaderLabel);
        expect(component).toHaveClassName(`subHeaderLevel-${subHeaderLevel}`);
        expect(component.find('td')).toHaveClassName('subHeaderCell');
    });

    it('can be collapsed if it is a subheader row', () => {
        spyOn(subHeaderProps, 'toggleCollapseGroup');

        component = shallow(<QbRow {...subHeaderProps}/>);
        let instance = component.instance();

        let collapseToggleButton = component.find({onClick: instance.toggleCollapseGroup});
        expect(collapseToggleButton).toBePresent();

        collapseToggleButton.simulate('click');

        expect(subHeaderProps.toggleCollapseGroup).toHaveBeenCalledWith(subHeaderId);
    });
});
