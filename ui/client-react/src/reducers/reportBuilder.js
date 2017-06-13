import * as types from '../actions/types';
import ReportModelHelper from '../models/reportModelHelper';

const reportBuilder = (
    state = {
        redirectRoute: null,
        isPendingEdit: false,
        isInBuilderMode: false,
        availableColumns: [],
        addBeforeColumn: false,
        labelBeingDragged: ''
    }, action) => {

    switch (action.type) {
    case types.UPDATE_REPORT_REDIRECT_ROUTE: {
        return {
            ...state,
            redirectRoute: action.content.route
        };
    }
    case types.SET_IS_PENDING_EDIT_TO_FALSE: {
        return {
            ...state,
            isPendingEdit: false
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
    case types.INSERT_PLACEHOLDER_COLUMN: {
        return {
            ...state,
            addBeforeColumn: action.content.addBeforeColumn
        };
    }
    case types.CHANGE_REPORT_NAME:
    case types.MOVE_COLUMN:
    case types.HIDE_COLUMN:
    case types.ADD_COLUMN_FROM_EXISTING_FIELD: {
        return {
            ...state,
            isPendingEdit: true
        };
    }
    case types.DRAGGING_COLUMN_START: {
        return {
            ...state,
            labelBeingDragged: action.content.sourceLabel
        }
    }
    case types.DRAGGING_COLUMN_END: {
        return {
            ...state,
            labelBeingDragged: ''
        }
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default reportBuilder;
