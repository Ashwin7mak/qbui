import React from 'react';
import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import * as UrlConsts from "../../constants/urlConstants";
import * as CompConsts from '../../constants/componentConstants';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
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

        const defaultFeatureName = Locale.getMessage("featureSwitchAdmin.defaultFeatureName");
        let proposed = defaultFeatureName;

        let nameFound = this.getFeatureByName(proposed);

        for (let i = 1; nameFound; i++) {
            proposed = `${defaultFeatureName} (${i})`;
            nameFound = this.getFeatureByName(proposed);
        }

        return proposed;
    }

    createFeatureSwitch() {
        this.props.createFeatureSwitch(this.getDefaultFeatureSwitchName()).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.featureSwitchCreated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });
    }

    deleteSelectedSwitches() {
        this.props.deleteFeatureSwitches(this.state.selectedRows).then(
            () => {
                NotificationManager.success(Locale.getMessage("featureSwitchAdmin.featureSwitchesDeleted"), Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                this.setState({selectedRows: [], allSelected: false});
            }
        );

    }

    updateFeatureSwitch(id, property, value) {

        const featureSwitch = this.props.switches.find(sw => sw.id === id);

        this.props.updateFeatureSwitch(id, featureSwitch, property, value).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.featureSwitchUpdated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });
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
                    label: Locale.getMessage("featureSwitchAdmin.switchName"),
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
                    label: Locale.getMessage("featureSwitchAdmin.teamName")
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY,
                header: {
                    label: Locale.getMessage("featureSwitchAdmin.description")
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY,
                header: {
                    label: Locale.getMessage("featureSwitchAdmin.onOrOff")
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
        const selectedSizeLabel = selectedSize > 0 && `${selectedSize} ${Locale.getMessage("featureSwitchAdmin.selectedFeatures")}`;

        return (
            <div className="featureSwitches">
                <h1><I18nMessage message="featureSwitchAdmin.featureSwitchesTitle"/></h1>

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

                    <button disabled={selectedSize === 0} onClick={this.deleteSelectedSwitches}><I18nMessage message="featureSwitchAdmin.delete"/></button>
                    <button disabled={selectedSize === 0} onClick={() => this.setSelectedSwitchStates(true)}><I18nMessage message="featureSwitchAdmin.turnOn"/></button>
                    <button disabled={selectedSize === 0} onClick={() => this.setSelectedSwitchStates(false)}><I18nMessage message="featureSwitchAdmin.turnOff"/></button>
                    <span>{selectedSizeLabel}</span>
                </div>

                <PageTitle title={Locale.getMessage("featureSwitchAdmin.featureSwitchesTitle")} />
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
