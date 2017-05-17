import * as types from '../actions/types';
import ReportModelHelper from '../models/reportModelHelper';

const reportBuilder = (
    state = {
        redirectRoute: null,
        isInBuilderMode: false,
        isCollapsed: false,
        addBeforeColumn: null,
        availableColumns: []
    }, action) => {

    switch (action.type) {
    case types.UPDATE_REPORT_REDIRECT_ROUTE: {
        return {
            ...state,
            redirectRoute: action.content.route
        };
    }
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
    case types.ENTER_BUILDER_MODE: {
        return {
            ...state,
            isInBuilderMode: true
        };
    }
    case types.EXIT_BUILDER_MODE: {
        return {
            ...state,
            isInBuilderMode: false
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default reportBuilder;
