import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import Stage from '../../stage/stage';
import IconActions from '../../actions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import TableCreationPanel from '../tableCreationPanel';
import * as TablePropertiesActions from '../../../actions/tablePropertiesActions';


const TablePropertiesRoute = React.createClass({

    getExistingTableNames() {
        if (this.props.app && this.props.app.tables) {
            return this.props.app.tables.map((table) => table.name);
        }
        return [];
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {i18nMessageKey: 'pageActions.deleteTable', icon:'delete', className:'delete', onClick: this.deleteTable}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },
    getStageHeadline() {
        return <I18nMessage message={"pageActions.tableSettings"}/>;
    },
    componentWillReceiveProps(nextProps) {
        if ((nextProps.table && this.props.table && this.props.table.id !== nextProps.table.id) || (!this.props.table && nextProps.table)) {
            nextProps.getTableProperties(nextProps.app.id, nextProps.table.id);
        }
    },

    render() {
        return (<div>
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}></Stage>

            <div className="TableInfoPanel">
                <TableCreationPanel tableInfo={this.props.tableProperties.tableInfo}
                                    tableMenuOpened={this.props.tableMenuOpened}
                                    tableMenuClosed={this.props.tableMenuClosed}
                                    setTableProperty={this.props.setTableProperty}
                                    setEditingProperty={this.props.setEditingProperty}
                                    focusOn={this.props.tableProperties.editing}
                                    validate={this.props.tableProperties.edited}
                                    appTables={this.getExistingTableNames()}
                                     />
                <div className="TableInfoButtons">
                    <Button className="secondaryButton"><I18nMessage message={"nav.cancel"}/></Button>
                    <Button className="primaryButton"><I18nMessage message={"nav.apply"}/></Button>
                </div>
            </div>
        </div>);
    }

});

const mapStateToProps = (state) => {
    return {
        tableProperties: state.tableProperties
    };
};

export default connect(
    mapStateToProps,
    TablePropertiesActions
)(TablePropertiesRoute);
