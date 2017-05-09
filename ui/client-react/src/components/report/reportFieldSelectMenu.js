import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {CONTEXT} from '../../actions/context';
import {refreshFieldSelectMenu, closeFieldSelectMenu, addColumnFromExistingField} from '../../actions/reportActions';

import ReportUtils from '../../utils/reportUtils';
import FieldFormats from '../../utils/fieldFormats';

import {FieldTokenInMenu} from '../formBuilder/fieldToken/fieldTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import QBicon from '../qbIcon/qbIcon';
import Locale from '../../../../reuse/client/src/locales/locale';
import SideMenuBase from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';

import './reportFieldSelectMenu.scss';

export class ReportFieldSelectMenu extends Component {
    constructor(props) {
    super(props);

}

    componentDidMount() {
        this.refreshMenuContent();
        this.props.closeFieldSelectMenu(CONTEXT.REPORT.NAV);
    }

    refreshMenuContent = () => {
        this.props.refreshFieldSelectMenu(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId);
    };

    getHiddenColumns = () => {
        let reportData = this.props.reportData;
        let columns = reportData.data ? reportData.data.columns : [];
        let visibleColumns = columns.filter(column => {
            return !column.isHidden;
        });
        let availableColumns = this.props.menu.availableColumns;
        return ReportUtils.getDifferenceOfColumns(availableColumns, visibleColumns);
    };

    getElements = () => {
        let hiddenColumns = this.getHiddenColumns();
        let elements = [];
        for (let i = 0; i < hiddenColumns.length; i++) {
            let type = FieldFormats.getFormatType(hiddenColumns[i].fieldDef);
            elements.push({
                key: hiddenColumns[i].id + "",
                title: hiddenColumns[i].headerName,
                type: type,
                onClick: (() => {
                    this.props.addColumnFromExistingField(CONTEXT.REPORT.NAV, hiddenColumns[i], this.props.menu.addBeforeColumn);
                })
            });
        }
        return elements;
    };

    getMenuContent = () => {
        if (!this.props.menu) {return <div />;}

        let elements = this.getElements();

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
        let isCollapsed = this.props.menu ? this.props.menu.isCollapsed : true;

        return (
            <SideMenuBase {...this.props}
                          baseClass="reportFieldSelectMenu"
                          sideMenuContent={content}
                          isCollapsed={isCollapsed}
                          isDocked={false}
            />
        );
    }
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
};

const mapStateToProps = (state) => {
    return {
        menu: state.reportBuilder
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeFieldSelectMenu: (context) => {
            dispatch(closeFieldSelectMenu(context));
        },
        refreshFieldSelectMenu: (context, appId, tblId) => {
            dispatch(refreshFieldSelectMenu(context, appId, tblId));
        },
        addColumnFromExistingField: (context, requestedColumn, addBefore) => {
            dispatch(addColumnFromExistingField(context, requestedColumn, addBefore));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportFieldSelectMenu);
