// An element used when there are tables with a parent/child relationship. Eventually this element
// or something similar should be generated in the node layer and returned in a form JSON object.
// Similar to FormTextElement or FormFieldElement, see forms.js in the same mocks folder
import Consts from '../../../common/src/constants';

export const childReportElement = (orderIndex = 0, relationshipId = 0) => ({
    ChildReportElement: {
        displayOptions: [
            "VIEW",
            "ADD",
            "EDIT"
        ],
        type: Consts.REPORT_FORM_TYPE.CHILD_REPORT,
        orderIndex: orderIndex,
        positionSameRow: false,
        relationshipId: relationshipId
    }
});

// A relationship array containing a single relationship object. Currently returned as part of an
// app request. Used only by unit tests.
export const relationships = [
    {
        "masterAppId": "1",
        "masterTableId": "2",
        "masterFieldId": 2,
        "detailAppId": "1",
        "detailTableId": "5",
        "detailFieldId": 2,
        "id": 0,
        "appId": "1",
        "description": "Referential integrity relationship between Master / Child Tables",
        "referentialIntegrity": false,
        "cascadeDelete": false,
        "childDefaultReportId": 0
    }
];
