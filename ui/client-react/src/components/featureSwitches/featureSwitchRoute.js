import React from 'react';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as edit from 'react-edit';
import ToggleButton from 'react-toggle-button';
import uuid from 'uuid';
import _ from 'lodash';

import './featureSwitches.scss';

const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;

const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true;

class FeatureSwitchRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(),
            selectedRows: [],
            allSelected: false
        }

        this.getFeatureSwitchID = this.getFeatureSwitchID.bind(this);
        this.saveSwitches = this.saveSwitches.bind(this);
        this.addException = this.addException.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deleteSelectedExceptions = this.deleteSelectedExceptions.bind(this);
    }

    saveSwitches() {
        this.props.saveSwitches(this.props.switches);
    }

    addException() {
        this.props.createExceptionRow(this.getFeatureSwitchID().id, uuid.v4());
    }

    selectRow(id, selected) {

        const selectedRows = selected ? [...this.state.selectedRows, id] : _.without(this.state.selectedRows, id);
        const allSelected = selectedRows.length === this.props.switches.length;

        this.setState({selectedRows, allSelected});
    }

    selectAll(allSelected) {

        const selectedRows = allSelected ? this.props.switches.map(sw => sw.id) : [];

        this.setState({selectedRows, allSelected});
    }

    setSelectedExceptionStates(defaultOn) {
        this.state.selectedRows.forEach((id) => {
            this.props.setSwitchExceptionState(id, defaultOn)
        });
    }

    deleteSelectedExceptions() {
        this.state.selectedRows.forEach((id) => {
            this.props.deleteException(id);
        });
        this.setState({selectedRows: []});
    }

    getFeatureSwitch() {

        return this.props.switches.find(item => item.id === parseInt(this.props.params.id));
    }

    getFeatureSwitchID() {

        return parseInt(this.props.params.id);
    }

    getColumns() {

        const editable = edit.edit({
            isEditing: ({columnIndex, rowData}) => columnIndex === rowData.editing,
            onActivate: ({columnIndex, rowIndex}) => {
                this.props.editExceptionRow(rowIndex, columnIndex);
            },
            onValue: ({value, rowIndex, property}) => {
                this.props.confirmExceptionEdit(rowIndex, property, value);
            }
        });

        return [
            {
                property: 'entityType',
                header: {
                    label: 'Type'
                },
                cell: {
                    transforms: [editable(edit.dropdown({options: [{name:'Realm',value:'realm'},{name:'App',value:'app'}]}))]
                }
            },
            {
                property: 'entityValue',
                header: {
                    label: 'ID'
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: 'on',
                header: {
                    label: 'On/Off'
                },
                cell: {
                    formatters: [
                        (value, {rowIndex}) => {
                            return <ToggleButton  value={value}
                                                  onToggle={(value) => {
                                                      this.props.setExceptionState(rowIndex, !value)
                                                  }}/>
                        }

                    ]
                }
            },
            {
                header: {
                    label: 'Overrides default?'
                },
                cell: {
                    formatters: [
                        (value, {rowData}) => {
                            return <span>{rowData.on !== this.getFeatureSwitch().defaultOn ? "Yes" : "No"} </span>
                        }

                    ]
                }
            }
        ]
    }

    getTableRowsWithIds(rows) {
        return rows.map((row, i) => {return {...row, id: i}});
    }

    componentDidMount() {
        if (this.props.switches.length === 0) {
            this.props.getSwitches().then(() => {console.log('okay');this.props.editExceptions(this.getFeatureSwitchID());});
        }
        else {
            this.props.editExceptions(this.getFeatureSwitchID());
        }

    }

    render() {

        let featureSwitch = this.props.switches.find((item) => item.id === this.getFeatureSwitchID());

        return (
            <div className="featureSwitches">
                <div><strong>Team:</strong> {featureSwitch.team}</div>
                <div><strong>Description:</strong> {featureSwitch.description}</div>
                <div><strong>Default State:</strong> {featureSwitch.defaultOn ? "On" : "Off"}</div>
                <p/>
                <h3>Feature Switch Exceptions:</h3>
                <Table.Provider className="featureSwitchTable exceptions"
                                columns={this.state.columns}
                                components={{
                                    body: {
                                        wrapper: BodyWrapper,
                                        row: RowWrapper
                                    }
                                }}>

                    <Table.Header />

                    <Table.Body rows={this.getTableRowsWithIds(this.props.exceptions)} rowKey="id" />
                </Table.Provider>
            </div>
        );
    }
};


const mapStateToProps = (state) => {

    return {
        edited: state.featureSwitches.edited,
        switches: state.featureSwitches.switches,
        exceptions: state.featureSwitches.exceptions
    };
};

export default connect(
    mapStateToProps,
    FeatureSwitchActions
)(FeatureSwitchRoute);
