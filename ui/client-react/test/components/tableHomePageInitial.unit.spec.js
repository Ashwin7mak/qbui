import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TableHomePageInitial from '../../src/components/table/tableHomePageInitial';

let component;

describe('TableHomePageInitial', () => {


    const props = {
        selectedTable: {
            tableIcon: "projects"
        },
        onCreateTable: () => {},
        onAddRecord: () => {}
    };

    beforeEach(() => {
        jasmineEnzyme();

        spyOn(props, 'onCreateTable');
        spyOn(props, 'onAddRecord');
    });

    afterEach(() => {
        props.onCreateTable.calls.reset();
        props.onAddRecord.calls.reset();
    });

    it('initial table homepage', () => {
        component = shallow(<TableHomePageInitial {...props}/>);
        expect(component.find(".tableHomePageInitial").length).toEqual(1);

        let addRecordButton = component.find(".addRecordButton");
        expect(addRecordButton.length).toEqual(1);

        addRecordButton.simulate('click');
        expect(props.onAddRecord).toHaveBeenCalled();

        let createTableLink = component.find(".createTableLink");
        expect(createTableLink.length).toEqual(1);

        createTableLink.simulate('click');
        expect(props.onCreateTable).toHaveBeenCalled();
    });
});
