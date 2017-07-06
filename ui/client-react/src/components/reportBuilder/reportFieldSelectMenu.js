import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {CONTEXT} from '../../actions/context';
import {refreshFieldSelectMenu, addColumnFromExistingField, insertPlaceholderColumn, moveColumn, hideColumn} from '../../actions/reportBuilderActions';
import {draggingColumnStart, draggingColumnEnd} from '../../actions/qbGridActions';
import ReportUtils from '../../utils/reportUtils';
import FieldFormats from '../../utils/fieldFormats';

import DraggableTokenInMenu from '../../../../reuse/client/src/components/dragAndDrop/elementToken/draggableTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import Locale from '../../../../reuse/client/src/locales/locale';
import {DroppableSideMenuBase} from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';

import './reportFieldSelectMenu.scss';

export class ReportFieldSelectMenu extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.refreshMenuContent();
    }

    refreshMenuContent = () => {
        this.props.refreshFieldSelectMenu(this.props.appId, this.props.tblId);
    };

    getHiddenColumns = () => {
        let reportData = this.props.reportData;
        let columns = reportData.data ? reportData.data.columns : [];
        let visibleColumns = columns.filter(column => {
            if (!(column.headerName === this.props.fieldBeingDragged)) {
                return !column.isHidden;
            }
            return false;
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
                }),
                onHoverBeforeAdded: (() => {
                    this.props.addColumnFromExistingField(CONTEXT.REPORT.NAV, hiddenColumns[i], this.props.menu.addBeforeColumn);
                    this.props.draggingColumnStart(hiddenColumns[i].headerName);
                }),
                beginDrag: ((props) => {
                    return {
                        onHover: props.onHover,
                        title: props.title,
                        type: props.type,
                        relatedField: {
                            name: props.title,
                            datatypeAttributes: {
                                type: props.type
                            }
                        }
                    };
                }),
                onHover: (((targetProps, sourceProps) => {
                    if ((sourceProps.title !== targetProps.label) && sourceProps.title && targetProps.label) {
                        this.props.moveColumn(CONTEXT.REPORT.NAV, sourceProps.title, targetProps.label);
                    }
                })),
                endDrag: (() => {
                    this.props.draggingColumnEnd();
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
                    childElementRenderer={DraggableTokenInMenu}
                    elements={elements}
                />
            </div>
        );
    };

    onDrop = (dropTargetProps, dragItemProps) => {
        this.props.hideColumn(CONTEXT.REPORT.NAV, dragItemProps.relatedField.id);
    };

    render() {
        return (
            <DroppableSideMenuBase
                baseClass="reportFieldSelectMenu"
                isDroppable={true}
                onDrop={this.onDrop}
                sideMenuContent={this.getMenuContent()}
                isCollapsed={this.props.isCollapsed}>
                {this.props.children}
            </DroppableSideMenuBase>
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
        fieldBeingDragged: state.reportBuilder.fieldBeingDragged,
        isCollapsed: state.builderNav.isNavCollapsed
    };
};

const mapDispatchToProps = {
    refreshFieldSelectMenu,
    addColumnFromExistingField,
    insertPlaceholderColumn,
    moveColumn,
    hideColumn,
    draggingColumnStart,
    draggingColumnEnd
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportFieldSelectMenu);
