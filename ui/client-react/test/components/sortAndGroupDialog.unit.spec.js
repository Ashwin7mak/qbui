import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SortAndGroupDialog, {__RewireAPI__ as SortAndGroupDialogRewireAPI}  from '../../src/components/sortGroup/sortAndGroupDialog';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

var FieldsPanelMock = React.createClass({
    render: function() {
        return (
            <div>FieldsPanelMock</div>
        );
    }
});
var FieldSettingsMock = React.createClass({
    render: function() {
        return (
            <div>FieldSettingsMock</div>
        );
    }
});

describe('SortAndGroupDialog functions', () => {
    'use strict';

    let component;


    beforeEach(() => {
        SortAndGroupDialogRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        SortAndGroupDialogRewireAPI.__Rewire__('FieldsPanel', FieldsPanelMock);
        SortAndGroupDialogRewireAPI.__Rewire__('FieldSettings', FieldSettingsMock);
    });

    afterEach(() => {
        SortAndGroupDialogRewireAPI.__ResetDependency__('I18nMessage');
        SortAndGroupDialogRewireAPI.__ResetDependency__('FieldsPanel');
        SortAndGroupDialogRewireAPI.__ResetDependency__('FieldSettings');
    });


    it('test render', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroupDialog/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with show=true', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroupDialog show={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test contains FieldsPanel', () => {
        component = TestUtils.renderIntoDocument(< SortAndGroupDialog show={true}/>);
        var _FieldsPanel = TestUtils.scryRenderedComponentsWithType(component, FieldsPanelMock);
        expect(_FieldsPanel.length).toEqual(1);
    });

    it('test contains FieldSettings', () => {
        component = TestUtils.renderIntoDocument(< SortAndGroupDialog show={true}/>);
        var _FieldSettings = TestUtils.scryRenderedComponentsWithType(component, FieldSettingsMock);
        expect(_FieldSettings.length).toEqual(2);
    });

});

