import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {DragDropContext} from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import ReportColumnTransformer from '../dataTable/reportGrid/reportColumnTransformer';
import ReportRowTransformer from '../dataTable/reportGrid/reportRowTransformer';
import ReportColumnHeaderMenu from '../dataTable/reportGrid/reportColumnHeaderMenu';
import ReportNameEditor from '../reportBuilder/reportNameEditor';
import ReportFieldSelectMenu from '../reportBuilder/reportFieldSelectMenu';
import ReportSaveOrCancelFooter from '../reportBuilder/reportSaveOrCancelFooter';
import QbGrid from '../dataTable/qbGrid/qbGrid';
import ReportCell from '../dataTable/reportGrid/reportCell';
import {CONTEXT} from '../../actions/context';
import {exitBuilderMode, closeFieldSelectMenu} from '../../actions/reportBuilderActions';

import './reportBuilderContainer.scss';

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    getSaveOrCancelFooter = () => {
        let {appId, tblId} = this.props.match.params;
        return <ReportSaveOrCancelFooter appId={appId} tblId={tblId}/>;
    };

    isOnlyOneColumnVisible(columns) {
        return columns.filter(column => {
                return !column.isHidden && !column.isPlaceholder;
            }).length === 1;
    };

    render() {
        let {appId, tblId, rptId} = this.props.match.params;
        let {columns, records, sortFids, name} = this.props.reportData.data;
        let transformedColumns = ReportColumnTransformer.transformColumnsForGrid(columns);
        transformedColumns.forEach(column => {
            column.fieldDef.userEditableValue = false;
        });
        let transformedRows = ReportRowTransformer.transformRecordsForGrid(records, columns);
        return (
            <div className="reportBuilderContainer">
                <ReportFieldSelectMenu
                    appId={appId}
                    tblId={tblId}
                    reportData={this.props.reportData}>
                    <div className="reportBuilderContainerContent">
                        {name && <ReportNameEditor name={name}/>}
                        <QbGrid
                            numberOfColumns={columns.length}
                            columns={transformedColumns}
                            rows={transformedRows}
                            isDraggable={true}
                            cellRenderer={ReportCell}
                            menuComponent={ReportColumnHeaderMenu}
                            showRowActionsColumn={false}
                            menuProps={{
                                appId: appId,
                                tblId: tblId,
                                rptId: rptId,
                                sortFids: sortFids,
                                isOnlyOneColumnVisible: this.isOnlyOneColumnVisible(columns)
                            }}
                        />
                    </div>
                </ReportFieldSelectMenu>
                {this.getSaveOrCancelFooter()}
            </div>
        );
    }
}

ReportBuilderContainer.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            /**
             * the app id */
            appId: PropTypes.string,

            /**
             * the table id */
            tblId: PropTypes.string
        })
    }),

    /**
     * A route that will be redirected to after a save/cancel action. Currently passed through mapState. */
    redirectRoute: PropTypes.string,

    /**
     * Controls the open state of the left tool panel */
    isOpen: PropTypes.bool,

    /**
     * Controls the collapsed state of the left tool panel */
    isCollapsed: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        reportBuilder: state.reportBuilder,
        reportData: (_.find(state.report, {'id': CONTEXT.REPORT.NAV}))
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        exitBuilderMode: (context) => dispatch(exitBuilderMode(context)),

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context))
    };
};

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(
    connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer));
