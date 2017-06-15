import AutomationListTransformer from '../../src/utils/automationListTransformer';
import ColumnTransformer from '../../src/components/dataTable/qbGrid/columnTransformer';
import RowTransformer from '../../src/components/dataTable/qbGrid/rowTransformer';
import constants from '../../src/components/automation/constants';

describe('AutomationListTransformer', () => {
    let testData = {
        automations: [
            {
                "appId": "testApp",
                "id": "testApp_automation1",
                "name": "TestAutomation1",
                "description": "Use Test Automation1",
                "version": 1,
                "active": true,
                "type": "EMAIL",
            },
            {
                "appId": "testApp",
                "id": "testApp_automation2",
                "name": "TestAutomation2",
                "description": "Use Test Automation2",
                "version": 1,
                "active": true,
                "type": "EMAIL",
            }
        ]};
    it('returns transformed automations list columns', () => {
        let expected = [];
        expected.push(new ColumnTransformer(constants.AUTOMATION_LIST.NAME, 1, ['gridHeaderCell'], 'gridHeaderLabel', false, false));
        expected.push(new ColumnTransformer(constants.AUTOMATION_LIST.DESCRIPTION, 2, ['gridHeaderCell'], 'gridHeaderLabel', false, false));
        expected.push(new ColumnTransformer(constants.AUTOMATION_LIST.ACTIVE, 3, ['gridHeaderCell'], 'gridHeaderLabel', false, false));
        let qbGridColumns = AutomationListTransformer.transformAutomationListColumnsForGrid(testData.automations);
        expect(qbGridColumns).toEqual(expected);
    });

    it('returns transformed automations list rows', () => {
        let row1Cells = [];
        row1Cells.push(AutomationListTransformer.createCellForField(constants.AUTOMATION_LIST.NAME, "TestAutomation1", "testApp_automation1", 1, false));
        row1Cells.push(AutomationListTransformer.createCellForField(constants.AUTOMATION_LIST.DESCRIPTION, "Use Test Automation1", "testApp_automation1", 2, false));
        row1Cells.push(AutomationListTransformer.createCellForField(constants.AUTOMATION_LIST.ACTIVE, "Yes", "testApp_automation1", 3, false));
        row1Cells.push(AutomationListTransformer.createCellForField(constants.AUTOMATION_LIST.ID, "testApp_automation1", "testApp_automation1", 4, false));
        let expected = new RowTransformer("testApp_automation1", row1Cells);
        let qbGridRows = AutomationListTransformer.transformAutomationListRowsForGrid(testData.automations);

        expect(qbGridRows[0].id).toEqual(expected.id);
        expect(qbGridRows[0]['1'].display).toEqual(expected['1'].display);
        expect(qbGridRows[0]['2'].display).toEqual(expected['2'].display);
        expect(qbGridRows[0]['3'].display).toEqual(expected['3'].display);
    });

});