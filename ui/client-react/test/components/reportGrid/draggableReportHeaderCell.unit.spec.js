import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {DraggableReportHeaderCell, __RewireAPI__ as ReportHeaderRewireAPI} from '../../../src/components/dataTable/reportGrid/draggableReportHeaderCell';

let component;

const props = {
    moveColumn: () => {},
    label: 'Label'
};

class mockDraggableHeaderCell extends React.Component {
    render() {
        return <div />;
    }
}

describe('DraggableReportHeaderCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
        ReportHeaderRewireAPI.__Rewire__('DraggableHeaderCell', mockDraggableHeaderCell);
    });

    afterEach(() => {
        ReportHeaderRewireAPI.__ResetDependency__('DraggableHeaderCell');
    });

    it('renders a header cell with correct props', () => {
        component = shallow(<DraggableReportHeaderCell {...props} />);
        let instance = component.instance();

        expect(component.find({onHover: instance.onHover})).toBePresent();
    });
});
