import React from 'react';
import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import ToggleButton from 'react-toggle-button';
import uuid from 'uuid';
import _ from 'lodash';
import './featureSwitches.scss';

const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;

const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true;

class FeatureSwitchesRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(),
            selectedRows: [],
            allSelected: false
        }

        this.saveSwitches = this.saveSwitches.bind(this);
        this.addNewFeature = this.addNewFeature.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deleteSelectedSwitches = this.deleteSelectedSwitches.bind(this);
    }

    saveSwitches() {
        this.props.saveSwitches(this.props.switches);
    }

    addNewFeature() {
        this.props.createRow(uuid.v4());
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

    setSelectedSwitchStates(defaultOn) {
        this.state.selectedRows.forEach((id) => {
            this.props.setSwitchDefaultState(id, defaultOn)
        });
    }

    deleteSelectedSwitches() {
        this.state.selectedRows.forEach((id) => {
            this.props.deleteRow(id);
        });
        this.setState({selectedRows: []});
    }

    getColumns() {

        const editable = edit.edit({
            isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,
            onActivate: ({ columnIndex, rowData }) => {
                this.props.editRow(rowData.id, columnIndex);
            },
            onValue: ({ value, rowData, property }) => {
                this.props.confirmEdit(rowData.id, property, value);
            }
        });

        return [
            {
                property: 'selected',
                header: {
                    formatters: [
                        (data, {rowData}) => <input type="checkbox" checked={this.state.allSelected} onChange={(e) => {this.selectAll(e.target.checked);}}/>
                    ]
                },
                cell: {
                    formatters: [
                        (data, {rowData}) => <input type="checkbox" checked={this.state.selectedRows.includes(rowData.id)} onChange={(e) => {this.selectRow(rowData.id, e.target.checked);}}/>
                    ]
                }
            },
            {
                property: 'name',
                header: {
                    label: 'Switch Name',
                },
                cell: {
                    formatters: [
                        (data,{rowData}) => <Link onClick={e => {e.stopPropagation();}} to={`/qbase/admin/featureSwitch/${rowData.id}`}>{data}</Link>
                    ],
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: 'team',
                header: {
                    label: 'Team'
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: 'description',
                header: {
                    label: 'Description'
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: 'defaultOn',
                header: {
                    label: 'On/Off'
                },
                cell: {
                    formatters: [
                        (value, {rowData}) => {
                            return <ToggleButton  value={value} 
                                                  onToggle={(value) => { 
                                                      this.props.setSwitchDefaultState(rowData.id, !value) 
                                                  }}/>
                        }

                    ]
                }
            },
        ];
    }

    render() {
        const selectedSize = this.state.selectedRows.length;
        const selectedSizeLabel = selectedSize > 0 && (selectedSize + ' Selected feature(s)');

        return (
            <div className="featureSwitches">
                <h1>Feature Switches</h1>


                <div className="globalButtons">

                    <button onClick={this.addNewFeature}>Add new</button>
                    <button disabled={!this.props.edited} className='save' onClick={this.saveSwitches}>Save switches</button>
                </div>

                <Table.Provider className="featureSwitchTable switches"
                                columns={this.state.columns}
                                components={{
                                    body: {
                                        wrapper: BodyWrapper,
                                        row: RowWrapper
                                    }
                                }}>

                    <Table.Header />

                    <Table.Body rows={this.props.switches} rowKey="id" />
                </Table.Provider>

                <p/>

                <div className="selectionButtons">

                    <button disabled={selectedSize === 0} onClick={this.deleteSelectedSwitches}>Delete</button>
                    <button disabled={selectedSize === 0} onClick={() => this.setSelectedSwitchStates(true)}>Turn On</button>
                    <button disabled={selectedSize === 0} onClick={() => this.setSelectedSwitchStates(false)}>Turn Off</button>
                    <span>{selectedSizeLabel}</span>
                </div>


            </div>
        );
    }
};


const mapStateToProps = (state) => {

    return {
        edited: state.featureSwitches.edited,
        switches: state.featureSwitches.switches
    };
};


export default connect(
    mapStateToProps,
    FeatureSwitchActions
)(FeatureSwitchesRoute);
