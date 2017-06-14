import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import SortMenuItem from "../../../../../src/common/grid/headerMenu/sort/sortMenuItem";
import MenuItem from "react-bootstrap/lib/MenuItem";
import * as FieldConsts from "../../../../../../client-react/src/constants/schema";
import Locale from "../../../../../../reuse/client/src/locales/locale";

describe('SortMenuItem', () => {

    let component;
    let inst;

    beforeEach(() => {
        jasmineEnzyme();
    });

    it("renders menu item component", () => {
        component = shallow(<SortMenuItem/>);
        expect(component.find(MenuItem)).toBePresent();
    });

    it("checks that MenuItem child component is sorted ascending using SortMenuItem props", () => {
        component = shallow(<SortMenuItem asc={true} />);
        expect(component.find(MenuItem)).toBePresent();

        expect(component.find(".sortAscendMenuText")).toBePresent();
        expect(component.find(".sortDescendMenuText")).not.toBePresent();
    });

    it("checks that MenuItem child component is sorted descending using SortMenuItem props", () => {
        component = shallow(<SortMenuItem asc={false} />);
        expect(component.find(MenuItem)).toBePresent();

        expect(component.find(".sortDescendMenuText")).toBePresent();
        expect(component.find(".sortAscendMenuText")).not.toBePresent();
    });

    it("checks all sorting messages for ascending sorts ", () => {
        let loc;
        let fConsts = {
            chBox: [
                FieldConsts.CHECKBOX
            ],
            txt:   [
                FieldConsts.TEXT,
                FieldConsts.URL,
                FieldConsts.USER,
                FieldConsts.EMAIL_ADDRESS
            ],
            time: [
                FieldConsts.DATE,
                FieldConsts.DATE_TIME,
                FieldConsts.TIME_OF_DAY
            ]
        };

        _.forEach(FieldConsts, (fConst) => {
            component = shallow(<SortMenuItem asc={true} fieldDef={{id: 10, datatypeAttributes: {type: fConst}}} />);
            expect(component.find(MenuItem)).toBePresent();

            if (_.includes(fConsts.chBox, fConst)) {
                loc = Locale.getMessage(`report.menu.sort.uncheckedToChecked`);
            }
            else if (_.includes(fConsts.txt, fConst)) {
                loc = Locale.getMessage(`report.menu.sort.aToZ`);
            }
            else if (_.includes(fConsts.time, fConst)) {
                loc = Locale.getMessage(`report.menu.sort.oldToNew`);
            }
            else {
                loc = Locale.getMessage(`report.menu.sort.lowToHigh`);
            }

            expect(component.find('.sortAscendMenuText')).toIncludeText(loc);
            expect(component.find(".sortDescendMenuText")).not.toBePresent();
        });
    });

    it("checks all sorting messages for descending sorts ", () => {
        let loc;
        let fConsts = {
            chBox: [
                FieldConsts.CHECKBOX
            ],
            txt:   [
                FieldConsts.TEXT,
                FieldConsts.URL,
                FieldConsts.USER,
                FieldConsts.EMAIL_ADDRESS
            ],
            time: [
                FieldConsts.DATE,
                FieldConsts.DATE_TIME,
                FieldConsts.TIME_OF_DAY
            ]
        };

        _.forEach(FieldConsts, (fConst) => {
            component = shallow(<SortMenuItem asc={false} fieldDef={{id: 10, datatypeAttributes: {type: fConst}}} />);
            expect(component.find(MenuItem)).toBePresent();

            if (_.includes(fConsts.chBox, fConst)) {
                loc = Locale.getMessage(`report.menu.sort.checkedToUnchecked`);
            }
            else if (_.includes(fConsts.txt, fConst)) {
                loc = Locale.getMessage(`report.menu.sort.zToA`);
            }
            else if (_.includes(fConsts.time, fConst)) {
                loc = Locale.getMessage(`report.menu.sort.newToOld`);
            }
            else {
                loc = Locale.getMessage(`report.menu.sort.highToLow`);
            }

            expect(component.find(".sortDescendMenuText")).toIncludeText(loc);
            expect(component.find('.sortAscendMenuText')).not.toBePresent();
        });
    });

    it("checks if the isSortedAsc returns false when no sortFids prop is given", () => {
        component = shallow(<SortMenuItem />);
        inst = component.instance();
        expect(inst.isSortedAsc()).toBeFalsy();
    });

    it("checks if the isSortedAsc returns false when the sortFids is 0", () => {
        component = shallow(<SortMenuItem sortFids={[0]} fieldDef={{id: 10}} />);
        inst = component.instance();
        expect(inst.isSortedAsc()).toBeFalsy();
    });

    it("checks if the isSortedAsc returns true when no sortFids prop is not 0 (positive) and matches fieldDef.id", () => {
        component = shallow(<SortMenuItem sortFids={[3]} fieldDef={{id: 3}} />);
        inst = component.instance();
        expect(inst.isSortedAsc()).toBeTruthy();
    });

    it("checks if the isSortedAsc returns true when no sortFids prop is not 0 (positive) and contains fieldDef.id", () => {
        component = shallow(<SortMenuItem sortFids={[9, 21, 3, 99]} fieldDef={{id: 3}} />);
        inst = component.instance();
        expect(inst.isSortedAsc()).toBeTruthy();
    });

    it("checks if the isSortedAsc returns false when sortFids is negative since it can't match a positive fieldDef.id", () => {
        component = shallow(<SortMenuItem sortFids={[-3]} fieldDef={{id: 3}} />);
        inst = component.instance();
        expect(inst.isSortedAsc()).toBeFalsy();
    });

    it("checks if the isColumnSorted returns false when no sortFids are given", () => {
        component = shallow(<SortMenuItem />);
        inst = component.instance();
        expect(inst.isColumnSorted()).toBeFalsy();
    });

    it("checks if the isColumnSorted returns false when the the sortedFids don't match the fieldDef.id", () => {
        component = shallow(<SortMenuItem sortFids={[21]} fieldDef={{id: 2}}/>);
        inst = component.instance();
        expect(inst.isColumnSorted()).toBeFalsy();
    });

    it("checks if the isColumnSorted returns true when the the sortedFids match the fieldDef.id", () => {
        component = shallow(<SortMenuItem sortFids={[2]} fieldDef={{id: 2}}/>);
        inst = component.instance();
        expect(inst.isColumnSorted()).toBeTruthy();
    });

    it("checks if the isColumnSorted returns true when the the sortedFids contain the fieldDef.id", () => {
        component = shallow(<SortMenuItem sortFids={[9, 3, 2, 20]} fieldDef={{id: 2}}/>);
        inst = component.instance();
        expect(inst.isColumnSorted()).toBeTruthy();
    });
});
