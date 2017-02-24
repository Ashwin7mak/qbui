import React from 'react';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as FeatureSwitchConsts from '../../constants/featureSwitchConstants';
import * as CompConsts from '../../constants/componentConstants';
import * as edit from 'react-edit';
import ToggleButton from 'react-toggle-button';
import PageTitle from '../pageTitle/pageTitle';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
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
        this.createOverride = this.createOverride.bind(this);
        this.updateOverride = this.updateOverride.bind(this);
        this.deleteSelectedOverrides = this.deleteSelectedOverrides.bind(this);
    }

    selectRow(id, selected) {

        let selectedRows = selected ? [...this.state.selectedRows, id] : _.without(this.state.selectedRows, id);

        const allSelected = selectedRows.length === this.props.overrides.length;

        this.setState({selectedRows, allSelected});
    }

    selectAll(allSelected) {

        let selectedRows = allSelected ? this.props.overrides.map((override) => override.id) : [];

        this.setState({selectedRows, allSelected});
    }

    setSelectedOverrideStates(defaultOn) {
        this.state.selectedRows.forEach((id) => {
            this.updateOverride(id, FeatureSwitchConsts.OVERRIDE_ON_KEY, defaultOn);
        });
    }

    deleteSelectedOverrides() {

        this.props.deleteOverrides(this.props.params.id, this.state.selectedRows).then(() => {

            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.overridesDeleted"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);

            this.setState({selectedRows: []});
        });
    }

    getFeatureSwitch() {

        return this.props.switches.find(item => item.id === this.props.params.id);
    }

    createOverride() {
        this.props.createOverride(this.props.params.id, this.props.overrides).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.overrideCreated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });
    }


    updateOverride(id, property, value) {

        const overrideToUpdate = this.props.overrides.find(override => override.id === id);

        this.props.updateOverride(this.props.params.id, id, overrideToUpdate, property, value).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.overrideUpdated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });
    }

    getColumns() {

        const editable = edit.edit({
            isEditing: ({columnIndex, rowData}) => columnIndex === rowData.editing,
            onActivate: ({columnIndex, rowData}) => {
                this.props.editOverride(rowData.id, columnIndex);

            },
            onValue: ({value, rowData, property}) => {
                this.updateOverride(rowData.id, property, value);
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
                property: FeatureSwitchConsts.OVERRIDE_TYPE_KEY,
                header: {
                    label: Locale.getMessage("featureSwitchAdmin.overrideType"),
                },
                cell: {
                    transforms: [editable(edit.dropdown({options: [{name:'Realm', value:'realm'}, {name:'App', value:'app'}]}))]
                }
            },
            {
                property: FeatureSwitchConsts.OVERRIDE_VALUE_KEY,
                header: {
                    label: Locale.getMessage("featureSwitchAdmin.overrideValue"),
                },
                cell: {
                    transforms: [editable(edit.input())]
                }
            },
            {
                property: FeatureSwitchConsts.OVERRIDE_ON_KEY,
                header: {
                    label: Locale.getMessage("featureSwitchAdmin.onOff"),
                },
                cell: {
                    formatters: [
                        (value, {rowData}) => {
                            return (
                             <ToggleButton value={value}
                                              onToggle={(newValue) => {
                                                  this.updateOverride(rowData.id, FeatureSwitchConsts.OVERRIDE_ON_KEY, !newValue);
                                              }}/>);
                        }

                    ]
                }
            },
            {
                header: {
                    label: Locale.getMessage("featureSwitchAdmin.overrideChangesDefault"),
                },
                cell: {
                    formatters: [
                        (value, {rowData}) => {
                            const doesOverride = rowData[FeatureSwitchConsts.OVERRIDE_ON_KEY] !== this.getFeatureSwitch()[FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY];

                            return (<span>
                                    {doesOverride  ? Locale.getMessage("featureSwitchAdmin.overridesYes") : Locale.getMessage("featureSwitchAdmin.overridesNo") }
                                </span>);
                        }

                    ]
                }
            }
        ];
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
            const selectedSizeLabel = selectedSize > 0 && `${selectedSize} ${Locale.getMessage("featureSwitchAdmin.selectedOverrides")}`;

            return (
                <div className="featureSwitches">
                    <div><strong><I18nMessage message="featureSwitchAdmin.switchName"/>:</strong> {featureSwitch[FeatureSwitchConsts.FEATURE_NAME_KEY]}</div>
                    <div><strong><I18nMessage message="featureSwitchAdmin.description"/>:</strong> {featureSwitch[FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY]}</div>
                    <div><strong><I18nMessage message="featureSwitchAdmin.teamName"/>:</strong> {featureSwitch[FeatureSwitchConsts.FEATURE_TEAM_KEY]}</div>
                    <div>
                        <strong><I18nMessage message="featureSwitchAdmin.defaultState"/>:</strong> {featureSwitch[FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY] ?
                        <I18nMessage message="featureSwitchAdmin.on"/> :
                        <I18nMessage message="featureSwitchAdmin.off"/>}
                    </div>
                    <p/>
                    <h3><I18nMessage message="featureSwitchAdmin.featureSwitchOverridesTitle"/>:</h3>

                    <div className="globalButtons">
                        <button onClick={this.createOverride}>Add new</button>
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

                            <Table.Body rows={this.props.overrides} rowKey="id"/>
                        </Table.Provider>
                    }
                    <p/>
                    <div className="selectionButtons">
                        <button disabled={selectedSize === 0} onClick={this.deleteSelectedOverrides}><I18nMessage message="featureSwitchAdmin.delete"/></button>
                        <button disabled={selectedSize === 0} onClick={() => this.setSelectedOverrideStates(true)}><I18nMessage message="featureSwitchAdmin.turnOn"/></button>
                        <button disabled={selectedSize === 0} onClick={() => this.setSelectedOverrideStates(false)}><I18nMessage message="featureSwitchAdmin.turnOff"/></button>
                        <span>{selectedSizeLabel}</span>
                    </div>

                    <PageTitle title={[Locale.getMessage('featureSwitchAdmin.featureswitchOverridesTitle'), featureSwitch[FeatureSwitchConsts.FEATURE_NAME_KEY]].join(Locale.getMessage('pageTitles.pageTitleSeparator'))} />
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
