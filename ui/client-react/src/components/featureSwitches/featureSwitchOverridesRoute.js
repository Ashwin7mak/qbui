import React from 'react';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as edit from 'react-edit';
import ToggleButton from 'react-toggle-button';
import PageTitle from '../pageTitle/pageTitle';
import Locale from '../../locales/locales';
import _ from 'lodash';

import './featureSwitches.scss';

const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;

const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true;

class FeatureSwitchOverridesRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(),
            selectedRows: [],
            allSelected: false
        } ;

        this.selectRow = this.selectRow.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.saveOverrides = this.saveOverrides.bind(this);
        this.deleteSelectedOverrides = this.deleteSelectedOverrides.bind(this);
    }

    selectRow(id, selected) {

        let selectedRows = selected ? [...this.state.selectedRows, id] : _.without(this.state.selectedRows, id);

        const allSelected = selectedRows.length === this.props.overrides.length;

        this.setState({selectedRows, allSelected});
    }

    selectAll(allSelected) {

        let selectedRows = allSelected ? this.props.overrides.map((sw, index) => index) : [];

        this.setState({selectedRows, allSelected});
    }

    setSelectedOverrideStates(defaultOn) {
        this.state.selectedRows.forEach((id) => {
            this.props.setOverrideState(id, defaultOn);
        });
    }

    deleteSelectedOverrides() {

        this.props.deleteOverrides(this.state.selectedRows);

        this.setState({selectedRows: []});
    }

    getFeatureSwitch() {

        return this.props.switches.find(item => item.id === this.props.params.id);
    }

    saveOverrides() {
        this.props.saveOverrides(this.props.params.id, this.props.overrides);
    }

    getColumns() {

        const editable = edit.edit({
            isEditing: ({columnIndex, rowData}) => columnIndex === rowData.editing,
            onActivate: ({columnIndex, rowIndex}) => {
                this.props.editOverrideRow(rowIndex, columnIndex);
            },
            onValue: ({value, rowIndex, property}) => {
                this.props.confirmOverrideEdit(rowIndex, property, value);
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
                property: 'entityType',
                header: {
                    label: 'Type'
                },
                cell: {
                    transforms: [editable(edit.dropdown({options: [{name:'Realm', value:'realm'}, {name:'App', value:'app'}]}))]
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
                            return (
                             <ToggleButton value={value}
                                              onToggle={(newValue) => {
                                                  this.props.setOverrideState(rowIndex, !newValue);
                                              }}/>);
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
                            return <span>{rowData.on !== this.getFeatureSwitch().defaultOn ? 'Yes' : 'No'} </span>;
                        }

                    ]
                }
            }
        ];
    }

    getTableRowsWithIds(rows) {
        return rows.map((row, i) => {return {...row, id: i};});
    }

    componentWillMount() {

        if (this.props.switches.length === 0) {
            this.props.getSwitches().then(() => {
                this.props.selectFeatureSwitchOverrides(this.props.params.id);
            });
        } else {
            this.props.selectFeatureSwitchOverrides(this.props.params.id);
        }
    }

    render() {

        let featureSwitch = this.props.switches.find((item) => item.id === this.props.params.id);

        if (featureSwitch) {

            const selectedSize = this.state.selectedRows.length;
            const selectedSizeLabel = selectedSize > 0 && (selectedSize + ' Selected overrides(s)');

            return (
                <div className="featureSwitches">
                    <div><strong>Name:</strong> {featureSwitch.name}</div>
                    <div><strong>Description:</strong> {featureSwitch.description}</div>
                    <div><strong>Team:</strong> {featureSwitch.team}</div>
                    <div><strong>Default State:</strong> {featureSwitch.defaultOn ? "On" : "Off"}</div>
                    <p/>
                    <h3>Feature Switch Overrides:</h3>

                    <div className="globalButtons">
                        <button onClick={this.props.createOverride}>Add new</button>
                        <button disabled={!this.props.edited} className="save" onClick={this.saveOverrides}>Save overrides</button>
                    </div>

                    {this.props.overrides.length === 0 ?
                        <h4>No overrides have been set, click 'Add New' to add one.</h4> :
                        <Table.Provider className="featureSwitchTable overrides"
                                        columns={this.state.columns}
                                        components={{
                                            body: {
                                                wrapper: BodyWrapper,
                                                row: RowWrapper
                                            }
                                        }}>

                            <Table.Header />

                            <Table.Body rows={this.getTableRowsWithIds(this.props.overrides)} rowKey="id"/>
                        </Table.Provider>
                    }
                    <p/>
                    <div className="selectionButtons">
                        <button disabled={selectedSize === 0} onClick={this.deleteSelectedOverrides}>Delete</button>
                        <button disabled={selectedSize === 0} onClick={() => this.setSelectedOverrideStates(true)}>Turn On</button>
                        <button disabled={selectedSize === 0} onClick={() => this.setSelectedOverrideStates(false)}>Turn Off</button>
                        <span>{selectedSizeLabel}</span>
                    </div>

                    <PageTitle title={["Feature Switch Overrides", featureSwitch.name].join(Locale.getMessage('pageTitles.pageTitleSeparator'))} />
                </div>
            );
        } else {
            return false;
        }
    }
}


const mapStateToProps = (state) => {

    return {
        edited: state.featureSwitches.edited,
        switches: state.featureSwitches.switches,
        overrides: state.featureSwitches.overrides
    };
};

export default connect(
    mapStateToProps,
    FeatureSwitchActions
)(FeatureSwitchOverridesRoute);
