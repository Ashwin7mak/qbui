import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Consts from '../../../common/src/constants';

import {ChildReport, __RewireAPI__ as ChildReportRewireAPI} from '../../src/components/QBForm/childReport';


class BreakpointsAlwaysSmallMock {
    static isSmallBreakpoint() {
        return true;
    }
}

const appId = 1;
const childAppId = appId;
const childTableId = 2;
const childReportId = 3;
const childTableName = 'child table';
const detailKeyFid = 4;
const detailKeyValue = 5;
const type = Consts.REPORT_FORM_TYPE.CHILD_REPORT;
const childReportUrl = `/qbase/app/${appId}/table/${childTableId}/report/${childReportId}?detailKeyFid=${detailKeyFid}&detailKeyValue=${detailKeyValue}`;

const MockChildReport = (props) => {

    props = Object.assign({
        appId,
        childAppId,
        childTableId,
        childReportId,
        childTableName,
        detailKeyFid,
        detailKeyValue,
        type
    }, props);

    return <ChildReport {...props} />;
};

const MockNonEmbeddedChildReport = (props) => {
    props = Object.assign({
        appId,
        childAppId,
        childTableId,
        childReportId,
        childTableName,
        detailKeyFid,
        detailKeyValue,
        type: 'NOT_CHILD_REPORT'
    }, props);
    return <ChildReport {...props} />;
};

const I18nMessageMock = (input) => <div>{input}</div>;


const EmbeddedReportToolsAndContentMock = (props) => <div className="embeddedReportContainer"></div>;
const EmbeddedReportLinkMock = (props) => <div className="embeddedReportLink">{props.childTableName}</div>;
const EmbeddedAddChildLinkMock = (props) => <div className="embeddedAddChildLink"></div>;

describe('ChildReport', () => {
    beforeAll(() => {
        jasmineEnzyme();
        ChildReportRewireAPI.__Rewire__('EmbeddedReportToolsAndContent', EmbeddedReportToolsAndContentMock);
        ChildReportRewireAPI.__Rewire__('EmbeddedReportLink', EmbeddedReportLinkMock);
        ChildReportRewireAPI.__Rewire__('EmbeddedAddChildLink', EmbeddedAddChildLinkMock);
        ChildReportRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterAll(() => {
        ChildReportRewireAPI.__ResetDependency__('EmbeddedReportToolsAndContent');
        ChildReportRewireAPI.__ResetDependency__('EmbeddedReportLink');
        ChildReportRewireAPI.__ResetDependency__('EmbeddedAddChildLink');
        ChildReportRewireAPI.__ResetDependency__('I18nMessage');
    });

    let component, domComponent;

    it(`renders the component`, () => {
        component = shallow(MockChildReport());
        expect(component.find('.childReportContainer')).toBePresent();
    });

    [
        "appId",
        "childTableId",
        "childReportId",
        "detailKeyFid",
        "detailKeyValue"
    ].forEach(prop => {
        it(`does not render if ${prop} is not defined`, () => {
            const props = {};
            props[prop] = undefined;
            component = shallow(MockChildReport(props));
            expect(component.find(ChildReport)).not.toBePresent();

            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            const embeddedReportLink = component.find(EmbeddedReportLinkMock);
            const embeddedAddChildLinkMock = component.find(EmbeddedAddChildLinkMock);
            expect(embeddedReportContainer).not.toBePresent();
            expect(embeddedReportLink).not.toBePresent();
            expect(embeddedAddChildLinkMock).not.toBePresent();
        });
    });

    describe('in Large/Medium breakpoint', () => {
        it('renders EmbeddedReportToolsAndContent', () => {
            component = shallow(MockChildReport());
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            expect(embeddedReportContainer).toBePresent();
        });

        it('renders EmbeddedAddChildLink', () => {
            component = shallow(MockChildReport());
            const embeddedAddChildLink = component.find(EmbeddedAddChildLinkMock);
            expect(embeddedAddChildLink).toBePresent();
        });


        it('renders EmbeddedAddChildLink before EmbeddedReportToolsAndContent', () => {
            component = shallow(MockChildReport());
            const embeddedAddChildLink = component.find(EmbeddedAddChildLinkMock);
            expect(embeddedAddChildLink).toBePresent();
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            expect(embeddedReportContainer).toBePresent();
            const firstChild = component.find('.childReportContainer').childAt(0);
            const secondChild = component.find('.childReportContainer').childAt(1);
            expect(firstChild.type()).toEqual(EmbeddedAddChildLinkMock);
            expect(secondChild.type()).toEqual(EmbeddedReportToolsAndContentMock);
        });


        it('doesn\'t render if not CHILD_REPORT type', () => {
            component = shallow(MockNonEmbeddedChildReport());
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            const embeddedReportLink = component.find(EmbeddedReportLinkMock);
            expect(embeddedReportContainer).not.toBePresent();
            expect(embeddedReportLink).not.toBePresent();
        });

        it('passes the needed props to EmbeddedReportToolsAndContent', () => {
            component = shallow(MockChildReport());
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);

            const passedProps = embeddedReportContainer.props();
            const expectedProps = {
                appId: appId,
                tblId: childTableId,
                rptId: childReportId,
                detailKeyFid: detailKeyFid,
                detailKeyValue: detailKeyValue
            };

            expect(passedProps.appId).toEqual(expectedProps.appId);
            expect(passedProps.tblId).toEqual(expectedProps.tblId);
            expect(passedProps.rptId).toEqual(expectedProps.rptId);
            expect(passedProps.detailKeyFid).toEqual(expectedProps.detailKeyFid);
            expect(passedProps.detailKeyValue).toEqual(expectedProps.detailKeyValue);
        });

        describe('report details', () => {
            const testChildTableName = `Yogi's Awesome Bespoke Table`;
            const report = {
                recordsCount: 42
            };
            const testProps = {
                report,
                childTableName:testChildTableName,
                loadReportRecordsCount: () => null,
            };
            const testPropsReportLink = Object.assign({}, {type:Consts.REPORT_FORM_TYPE.REPORT_LINK}, testProps);

            it(`displays child table's name when showing report link buttons'`, () => {
                component = shallow(MockChildReport(testPropsReportLink));
                expect(component.text()).toContain(testChildTableName);
            });

            it('displays records count when showing report link buttons', () => {
                component = shallow(MockChildReport(testPropsReportLink));
                expect(component.text()).toContain(report.recordsCount);
            });

            it(`doesn't display child table's name when NOT showing report link buttons'`, () => {
                component = shallow(MockChildReport(testProps));
                expect(component.text()).not.toContain(testChildTableName);
            });

            it(`doesn't display records count when NOT showing report link buttons'`, () => {
                component = shallow(MockChildReport(testProps));
                expect(component.text()).not.toContain(report.recordsCount);
            });
        });

    });


    describe('in Small Breakpoint', () => {
        beforeAll(() => {
            ChildReportRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        });
        afterAll(() => {
            ChildReportRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('renders EmbeddedReportLink', () => {
            component = shallow(MockChildReport());
            const embeddedReportLink = component.find(EmbeddedReportLinkMock);
            expect(embeddedReportLink).toBePresent();
        });

        it('renders EmbeddedAddChildLink', () => {
            component = shallow(MockChildReport());
            const embeddedAddChildLink = component.find(EmbeddedAddChildLinkMock);
            expect(embeddedAddChildLink).toBePresent();
        });


        it('renders EmbeddedReportToolsAndContent before EmbeddedAddChildLink  ', () => {
            component = shallow(MockChildReport());
            const embeddedAddChildLink = component.find(EmbeddedAddChildLinkMock);
            expect(embeddedAddChildLink).toBePresent();
            const embeddedReportContainer = component.find(EmbeddedReportLinkMock);
            expect(embeddedReportContainer).toBePresent();
            const firstChild = component.find('.childReportContainer').childAt(0);
            const secondChild = component.find('.childReportContainer').childAt(1);
            expect(firstChild.type()).toEqual(EmbeddedReportLinkMock);
            expect(secondChild.type()).toEqual(EmbeddedAddChildLinkMock);
        });
    });
});
