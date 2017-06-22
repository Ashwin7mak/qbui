import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {DropTarget} from 'react-dnd';

import {CONTEXT} from '../../actions/context';
import {refreshFieldSelectMenu, addColumnFromExistingField, insertPlaceholderColumn, moveColumn, hideColumn} from '../../actions/reportBuilderActions';
import {draggingColumnStart, draggingColumnEnd} from '../../actions/qbGridActions';
import ReportUtils from '../../utils/reportUtils';
import FieldFormats from '../../utils/fieldFormats';

import DraggableTokenInMenu from '../../../../reuse/client/src/components/dragAndDrop/elementToken/draggableTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import Locale from '../../../../reuse/client/src/locales/locale';
import SideMenu from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';
import DraggableItemTypes from '../../../../reuse/client/src/components/dragAndDrop/draggableItemTypes';

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
                    renderer={DraggableTokenInMenu}
                    elements={elements}
                />
            </div>
        );
    };

    render() {
        let {connectDropTarget} = this.props;
        return (
            connectDropTarget(
                <div style={divStyle}>
                    <SideMenu
                        baseClass="reportFieldSelectMenu"
                        sideMenuContent={this.getMenuContent()}
                        isCollapsed={this.props.isCollapsed}
                    >{this.props.children}
                    </SideMenu>
                </div>)
        );
    }
}

const divStyle = {
    height: '100%',
    width: '100%'
};

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

const mapDispatchToProps = {
    refreshFieldSelectMenu,
    addColumnFromExistingField,
    insertPlaceholderColumn,
    moveColumn,
    hideColumn,
    draggingColumnStart,
    draggingColumnEnd
};

const menuTarget = {
    drop(dropTargetProps, monitor) {
        let dragItemProps = monitor.getItem();
        dropTargetProps.hideColumn(CONTEXT.REPORT.NAV, dragItemProps.relatedField.id);
        return dropTargetProps;
    }
};

function collect(connectDropSource, monitor) {
    return {
        connectDropTarget: connectDropSource.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export default connect(mapStateToProps, mapDispatchToProps)
(DropTarget(DraggableItemTypes.FIELD, menuTarget, collect)(ReportFieldSelectMenu));
