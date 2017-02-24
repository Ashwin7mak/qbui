import React from 'react';
import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import * as UrlConsts from "../../constants/urlConstants";
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as FeatureSwitchConsts from '../../constants/featureSwitchConstants';
import ToggleButton from 'react-toggle-button';
import PageTitle from '../pageTitle/pageTitle';
import _ from 'lodash';
import './featureSwitches.scss';

const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;

const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true;


const expiredBehaviorOptions = [
    {name:'Turn feature on', value:'on'},
    {name:'Turn feature off', value:'off'},
    {name:'Flip on/off', value:'flip'}
];

class FeatureSwitchesRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(),
            selectedRows: [],
            allSelected: false
        };

        this.selectRow = this.selectRow.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.createFeatureSwitch = this.createFeatureSwitch.bind(this);
        this.updateFeatureSwitch = this.updateFeatureSwitch.bind(this);
        this.deleteSelectedSwitches = this.deleteSelectedSwitches.bind(this);
        this.getDefaultFeatureSwitchName  = this.getDefaultFeatureSwitchName.bind(this);
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

    setSelectedSwitchStates(isOn) {
        this.state.selectedRows.forEach((id) => {
            this.updateFeatureSwitch(id, FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY, isOn);
        });
    }

    getFeatureByName(name) {

        return this.props.switches.find((feature) => feature.name === name);
    }

    getDefaultFeatureSwitchName() {

        let proposed = 'Feature';

        let nameFound = this.getFeatureByName(proposed);

        for (let i = 1; nameFound; i++) {
            proposed = `Feature (${i})`;
            nameFound = this.getFeatureByName(proposed);
        }

        return proposed;
    }

    createFeatureSwitch() {
        this.props.createFeatureSwitch(this.getDefaultFeatureSwitchName());
    }

    deleteSelectedSwitches() {
        this.props.deleteFeatureSwitches(this.state.selectedRows).then(
            () => this.setState({selectedRows: [], allSelected: false})
        );
    }

    updateFeatureSwitch(id, property, value) {

        const featureSwitch = this.props.switches.find(sw => sw.id === id);

        this.props.updateFeatureSwitch(id, featureSwitch, property, value);
    }

    getColumns() {

        const editable = edit.edit({
            isEditing: ({columnIndex, rowData}) => columnIndex === rowData.editing,
            onActivate: ({columnIndex, rowData}) => {
                this.props.editFeatureSwitch(rowData.id, columnIndex);
            },
            onValue: ({value, rowData, property}) => {
                this.updateFeatureSwitch(rowData.id, property, value);
            }
        });

        const overridesLinkFormatter = (data, {rowData}) => {

            const hasOverrides = rowData.overrides && rowData.overrides.length > 0;
            return (
                <div>
                    <Link onClick={e => {e.stopPropagation();}}
                          to={`${UrlConsts.ADMIN_ROUTE}/featureSwitch/${rowData.id}`}>{data}</Link>
                     {hasOverrides ? <span> ({rowData.overrides.length})</span> : ''}
                </div>);
        };

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
                property: FeatureSwitchConsts.FEATURE_NAME_KEY,
                header: {
                    label: 'Switch Name',
                },
                cell: {
                    formatters: [
                        overridesLinkFormatter
                    ],
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: FeatureSwitchConsts.FEATURE_TEAM_KEY,
                header: {
                    label: 'Team'
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY,
                header: {
                    label: 'Description'
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY,
                header: {
                    label: 'On/Off'
                },
                cell: {
                    formatters: [
                        (value, {rowData}) => {
                            return (
                                <ToggleButton value={value}
                                              onToggle={newValue => {
                                                  this.updateFeatureSwitch(rowData.id, FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY, !newValue);
                                              }}/>);
                        }

                    ]
                }
            }
        ];
    }

    componentDidMount() {
        this.props.getSwitches();
    }

    render() {

        const selectedSize = this.state.selectedRows.length;
        const selectedSizeLabel = selectedSize > 0 && (selectedSize + ' Selected feature(s)');

        return (
            <div className="featureSwitches">
                <h1>Feature Switches</h1>


                <div className="globalButtons">
                    <button onClick={this.createFeatureSwitch}>Add new</button>
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

                <PageTitle title="Feature Switches" />
            </div>
        );
    }
}


const mapStateToProps = (state) => {

    return {
        switches: state.featureSwitches.switches
    };
};


export default connect(
    mapStateToProps,
    FeatureSwitchActions
)(FeatureSwitchesRoute);
