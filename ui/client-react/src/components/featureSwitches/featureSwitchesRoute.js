import React from 'react';

import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {Link} from 'react-router';
import ToggleButton from 'react-toggle-button';
import PageTitle from '../pageTitle/pageTitle';
import _ from 'lodash';

import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import * as UrlConsts from "../../constants/urlConstants";
import * as CompConsts from '../../constants/componentConstants';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as FeatureSwitchConsts from '../../constants/featureSwitchConstants';

import './featureSwitches.scss';

// override the default reactabular body and row rendering which aggressively avoids updates
const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;

const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true;

class FeatureSwitchesRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(),
            selectedIDs: [],
            allSelected: false
        };

        // need to bind methods since we're an ES6 class

        this.selectRow = this.selectRow.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.createFeatureSwitch = this.createFeatureSwitch.bind(this);
        this.updateFeatureSwitch = this.updateFeatureSwitch.bind(this);
        this.deleteSelectedSwitches = this.deleteSelectedSwitches.bind(this);
        this.getDefaultFeatureSwitchName  = this.getDefaultFeatureSwitchName.bind(this);
    }

    /**
     * select a row
     * @param id
     * @param selected
     */
    selectRow(id, selected) {

        // add or remove selected row to selectedIDs
        const selectedIDs = selected ? [...this.state.selectedIDs, id] : _.without(this.state.selectedIDs, id);

        // set header checkbox state appropriately
        const allSelected = selectedIDs.length === this.props.switches.length;

        this.setState({selectedIDs, allSelected});
    }

    /**
     * select all rows from header checkbox
     * @param allSelected true to select all, false to deselect all
     */
    selectAll(allSelected) {

        const selectedIDs = allSelected ? this.props.switches.map(sw => sw.id) : [];

        this.setState({selectedIDs, allSelected});
    }

    /**
     * turn on/off selected features at once
     * @param isOn
     */
    setSelectedSwitchStates(isOn) {
        this.state.selectedIDs.forEach((id) => {
            this.updateFeatureSwitch(id, FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY, isOn);
        });
    }

    /**
     * find switch with given name
     * @param name
     */
    getFeatureByName(name) {

        return this.props.switches.find((feature) => feature.name === name);
    }

    /**
     * get default feature name that doesn't conflict with an existing name
     * @returns Feature, Feature (1), Feature (2) etc.
     */
    getDefaultFeatureSwitchName() {

        const defaultFeatureName = Locale.getMessage("featureSwitchAdmin.defaultFeatureName");
        let proposed = defaultFeatureName;

        let nameFound = this.getFeatureByName(proposed);

        // append (i) to name until it's unique
        for (let i = 1; nameFound; i++) {
            proposed = `${defaultFeatureName} (${i})`;
            nameFound = this.getFeatureByName(proposed);
        }

        return proposed;
    }

    /**
     * create new feature switch
     */
    createFeatureSwitch() {
        this.props.createFeatureSwitch(this.getDefaultFeatureSwitchName()).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.featureSwitchCreated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });
    }

    /**
     * delete selected switches
     */
    deleteSelectedSwitches() {
        this.props.deleteFeatureSwitches(this.state.selectedIDs).then(
            () => {
                NotificationManager.success(Locale.getMessage("featureSwitchAdmin.featureSwitchesDeleted"), Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                this.setState({selectedIDs: [], allSelected: false});
            }
        );

    }

    /**
     * update a feature switch property
     * @param id
     * @param property
     * @param value
     */
    updateFeatureSwitch(id, property, value) {

        const featureSwitch = this.props.switches.find(sw => sw.id === id);

        if (property === FeatureSwitchConsts.FEATURE_NAME_KEY) {
            const featureByName = this.getFeatureByName(value);

            // prevent renaming feature to an existing name (unless it's the currently edited feature)

            if (featureByName.id !== id) {
                NotificationManager.error(Locale.getMessage('featureSwitchAdmin.featureNameExists'), Locale.getMessage('failed'),
                    CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                return;
            }
        }

        this.props.updateFeatureSwitch(id, featureSwitch, property, value).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.featureSwitchUpdated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });

    }

    /**
     * get reactabular columns
     * @returns {[*,*,*,*,*]}
     */
    getColumns() {

        // inline editing via react-edit

        const editable = edit.edit({
            isEditing: ({columnIndex, rowData}) => columnIndex === rowData.editing,
            onActivate: ({columnIndex, rowData}) => {
                this.props.editFeatureSwitch(rowData.id, columnIndex);
            },
            onValue: ({value, rowData, property}) => {
                this.updateFeatureSwitch(rowData.id, property, value);
            }
        });

        // render feature switch names as a link to the overrides with # overrides in parenthesis

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
                        (data, {rowData}) => <input type="checkbox" checked={this.state.selectedIDs.includes(rowData.id)} onChange={(e) => {this.selectRow(rowData.id, e.target.checked);}}/>
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

    /**
     * get switches whenever the component mounts
     */
    componentDidMount() {
        this.props.getSwitches();
    }

    render() {

        const selectedSize = this.state.selectedIDs.length;
        const selectedSizeLabel = selectedSize > 0 && `${selectedSize} ${Locale.getMessage("featureSwitchAdmin.selectedFeatures")}`;

        return (
            <div className="featureSwitches">
                <h1><I18nMessage message="featureSwitchAdmin.featureSwitchesTitle"/></h1>

                <div className="globalButtons">
                    <button onClick={this.createFeatureSwitch}><I18nMessage message="featureSwitchAdmin.addNew"/></button>
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

                    <button disabled={!selectedSize} onClick={this.deleteSelectedSwitches}><I18nMessage message="featureSwitchAdmin.delete"/></button>
                    <button disabled={!selectedSize} onClick={() => this.setSelectedSwitchStates(true)}><I18nMessage message="featureSwitchAdmin.turnOn"/></button>
                    <button disabled={!selectedSize} onClick={() => this.setSelectedSwitchStates(false)}><I18nMessage message="featureSwitchAdmin.turnOff"/></button>
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
