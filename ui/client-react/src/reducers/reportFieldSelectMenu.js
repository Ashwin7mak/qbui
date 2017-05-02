import * as types from '../actions/types';
import ReportModelHelper from '../models/reportModelHelper';
// Eventually this will get refactored into the reducer for Report Builder (like form builder but for reports)
const reportFieldSelectMenu = (
    state = {
        isCollapsed: true,
        addBeforeColumn: null,
        availableColumns: []
    }, action) => {

    switch (action.type) {
        case types.REFRESH_FIELD_SELECT_MENU: {
            let fields = action.content.response.data;
            let fids = fields.map(field => {
                return field.id;
            });
            let columns = ReportModelHelper.getReportColumns(fields, fids);
            return {
                ...state,
                availableColumns: columns
            };
        }
        case types.OPEN_FIELD_SELECT_MENU: {
            return {
                ...state,
                isCollapsed: false,
                addBeforeColumn: action.content.addBeforeColumn
            };
        }
        case types.CLOSE_FIELD_SELECT_MENU: {
            return {
                ...state,
                isCollapsed: true,
                addBeforeColumn: action.content.addBeforeColumn
            };
        }
        default:
            // return existing state by default in redux
            return state;
    }
};

export default reportFieldSelectMenu;