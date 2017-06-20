import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {CONTEXT} from '../../actions/context';
import {refreshFieldSelectMenu, addColumnFromExistingField} from '../../actions/reportBuilderActions';

import ReportUtils from '../../utils/reportUtils';
import FieldFormats from '../../utils/fieldFormats';

import {TokenInMenu} from '../../../../reuse/client/src/components/dragAndDrop/elementToken/tokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import Locale from '../../../../reuse/client/src/locales/locale';
import SideMenu from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';

import './reportFieldSelectMenu.scss';

export class ReportFieldSelectMenu extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.refreshMenuContent();
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
        let isCollapsed = this.props.isCollapsed;

        return (
            <div className="fieldSelect">
                {!isCollapsed &&
                    <div>
                        <div className="header">
                            {Locale.getMessage('report.drawer.title')}
                        </div>
                        <div className="info">
                            {Locale.getMessage('report.drawer.info')}
                        </div>
                    </div>
                    }
                <ListOfElements
                    renderer={TokenInMenu}
                    elements={elements}
                />
            </div>
        );
    };

    render() {
        return (
            <SideMenu
                baseClass="reportFieldSelectMenu"
                sideMenuContent={this.getMenuContent()}
                isCollapsed={this.props.isCollapsed}
            >
                {this.props.children}
            </SideMenu>
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
        menu: state.reportBuilder,
        isCollapsed: state.builderNav.isNavCollapsed
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshFieldSelectMenu: (context, appId, tblId) => {
            dispatch(refreshFieldSelectMenu(context, appId, tblId));
        },
        addColumnFromExistingField: (context, requestedColumn, addBefore) => {
            dispatch(addColumnFromExistingField(context, requestedColumn, addBefore));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportFieldSelectMenu);
