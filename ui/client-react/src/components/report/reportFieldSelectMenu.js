import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {CONTEXT} from '../../actions/context';
import {refreshFieldSelectMenu, closeFieldSelectMenu, addColumnFromExistingField} from '../../actions/reportActions';

import ReportUtils from '../../utils/reportUtils';

import {FieldTokenInMenu} from '../formBuilder/fieldToken/fieldTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import QBicon from '../qbIcon/qbIcon';
import Locale from '../../../../reuse/client/src/locales/locale';
import SideMenuBase from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';

import './reportFieldSelectMenu.scss'

export class ReportFieldSelectMenu extends Component {
    constructor(props) {
        super(props);

        this.refreshMenuContent();
    };

    componentDidMount() {
        if (this.props.appId && this.props.tblId) {
            this.refreshMenuContent();
        }
    };

    refreshMenuContent = () => {
        this.props.refreshFieldSelectMenu(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId);
    };

    getMenuContent = () => {
        let reportData = this.props.reportData;
        let elements = [];
        let columns = reportData.data ? reportData.data.columns : [];
        let visibleColumns = columns.filter(column => {
            return !column.isHidden;
        });
        let availableColumns = this.props.shell.fieldsSelectMenu.availableColumns;
        let hiddenColumns = ReportUtils.getDifferenceOfColumns(availableColumns, visibleColumns, 'id');
        for (let i = 0; i < hiddenColumns.length; i++) {
            let params = {
                requestedColumn: hiddenColumns[i],
                addBefore: this.props.shell.fieldsSelectMenu.addBefore
            };
            elements.push({
                key: hiddenColumns[i].id + "",
                title: hiddenColumns[i].headerName,
                type: hiddenColumns[i].fieldType,
                onClick: (() => {
                    this.props.addColumnFromExistingField(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, params);
                })
            });
        }

        return (
            <div className="fieldSelect">
                <QBicon
                    icon="close"
                    onClick={() => this.props.closeFieldSelectMenu(CONTEXT.REPORT.NAV)}
                    className="fieldSelectCloseIcon"
                />
                <div className="header">
                    {Locale.getMessage('report.drawer.title')}
                </div>
                <div className="info">
                    {Locale.getMessage('report.drawer.info')}
                </div>
                <ListOfElements
                    renderer={FieldTokenInMenu}
                    elements={elements}
                />
            </div>
        );
    };

    render() {
        let content = this.getMenuContent();

        return (
            <SideMenuBase {...this.props} baseClass="reportFieldSelectMenu" sideMenuContent={content}/>
        );
    };
}

ReportFieldSelectMenu.propTypes = {
    /**
     * Id of the app this menu is open on. */
    appId: PropTypes.string.isRequired,

    /**
     * Id of the table this menu is open on. */
    tblId: PropTypes.string.isRequired,

    /**
     * Data of this report */
    reportData: PropTypes.object,

    /**
     * Boolean value indicating whether the side menu is open or closed. Only applicable on small devices. */
    isOpen: PropTypes.bool,

    /**
     * Displays the panel at a collapsed width. Side menu must be open or docked to be visible. */
    isCollapsed: PropTypes.bool,

    /**
     * Sometimes, the side menu needs to open or close itself (e.g., on some touch events, when the screen size changes).
     * This callback will fire when the component needs to open or close itself. The response should be to update the state that is controlling isOpen. */
    onUpdateOpenState: PropTypes.func,

    /**
     * Sets the location of the side menu to the right side of the screen if true */
    pullRight: PropTypes.bool,

    /**
     * Determines whether the side menu will dock (stay open) at the medium or large breakpoints.
     * If false, visible behavior is only determined by isOpen.
     * Two warnings about this prop:
     *   1. Careful with this one as it breaks the XD pattern for left navs.
     *   2. If a new prop is passed at runtime, it won't visibly update until the next page resize */
    willDock: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        shell: state.shell
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeFieldSelectMenu: (context) => {
            dispatch(closeFieldSelectMenu(context));
        },
        refreshFieldSelectMenu: (context, appId, tblId) => {
            dispatch(refreshFieldSelectMenu(context, appId, tblId));
        },
        addColumnFromExistingField: (context, appId, tblId, params) => {
            dispatch(addColumnFromExistingField(context, appId, tblId, params));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportFieldSelectMenu);