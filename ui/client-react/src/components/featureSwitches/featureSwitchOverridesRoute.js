import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import ToggleButton from 'react-toggle-button';
import Loader from 'react-loader';
import PageTitle from '../pageTitle/pageTitle';
import QBModal from '../qbModal/qbModal';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';

import * as Table from 'reactabular-table';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as FeatureSwitchConsts from '../../constants/featureSwitchConstants';
import * as CompConsts from '../../constants/componentConstants';
import * as constants from '../../../../common/src/constants';
import * as edit from 'react-edit';

import './featureSwitches.scss';

// override the default reactabular body and row rendering which aggressively avoids updates
const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;

const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true;

export class FeatureSwitchOverridesRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(),
            selectedIDs: [],
            allSelected: false,
            confirmDeletesDialogOpen: false
        };

        // need to bind methods since we're an ES6 class

        this.selectRow = this.selectRow.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.createOverride = this.createOverride.bind(this);
        this.updateOverride = this.updateOverride.bind(this);
        this.deleteSelectedOverrides = this.deleteSelectedOverrides.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    /**
     * select override
     * @param id
     * @param selected
     */
    selectRow(id, selected) {

        let selectedIDs = selected ? [...this.state.selectedIDs, id] : _.without(this.state.selectedIDs, id);

        const allSelected = selectedIDs.length === this.props.overrides.length;

        this.setState({selectedIDs, allSelected});
    }

    /**
     * select all
     * @param allSelected true to select all, false to deselect all
     */
    selectAll(allSelected) {

        let selectedIDs = allSelected ? this.props.overrides.map((override) => override.id) : [];

        this.setState({selectedIDs, allSelected});
    }

    /**
     * turn on/off all selected overrides
     * @param defaultOn
     */
    setSelectedOverrideStates(defaultOn) {
        this.state.selectedIDs.forEach((id) => {
            this.updateOverride(id, FeatureSwitchConsts.OVERRIDE_ON_KEY, defaultOn);
        });
    }

    /**
     * delete selected overrides
     */
    deleteSelectedOverrides() {
        this.setState({confirmDeletesDialogOpen: false});

        this.props.deleteOverrides(this.props.params.id, this.state.selectedIDs).then(() => {

            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.overridesDeleted"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);

            this.setState({selectedIDs: []});
        });
    }

    /**
     * open confirm dialog
     */
    confirmDelete() {
        this.setState({confirmDeletesDialogOpen: true});
    }
    /**
     * close the delete confirm dialog
     */
    cancelDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    }

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmDialog() {

        let msg = Locale.getMessage('selection.deleteTheseOverrides');

        return (
            <QBModal
                uniqueClassName="confirmDeleteOverrides"
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('selection.delete')}
                primaryButtonOnClick={this.deleteSelectedOverrides}
                leftButtonName={Locale.getMessage('selection.dontDelete')}
                leftButtonOnClick={this.cancelDelete}
                bodyMessage={msg}
                type="alert"/>);
    }


    /**
     * get feature switch using ID from URL (passed by router)
     */
    getFeatureSwitch() {

        return this.props.switches.find(item => item.id === this.props.params.id);
    }

    /**
     * create new override
     */
    createOverride() {
        this.props.createOverride(this.props.params.id, this.props.overrides).then(() => {
            NotificationManager.success(Locale.getMessage("featureSwitchAdmin.overrideCreated"), Locale.getMessage('success'),
                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        });
    }

    /**
     * update am override property
     * @param id override ID
     * @param property entityType, entityValue, etc.
     * @param value new value for property
     */
    updateOverride(id, property, value) {

        const overrideToUpdate = this.props.overrides.find(override => override.id === id);

        if (overrideToUpdate[property] !== value) {
            this.props.updateOverride(this.props.params.id, id, overrideToUpdate, property, value).then(() => {
                NotificationManager.success(Locale.getMessage("featureSwitchAdmin.overrideUpdated"), Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
            });
        } else {
            this.props.overrideUpdated(id, property, value); // don't save, just get out of edit mode
        }
    }

    /**
     * get reactabular columns
     * @returns {[*,*,*,*,*]}
     */
    getColumns() {

        // react-edit plugin for inline editing
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
                        (data, {rowData}) => <input className="selectAll" type="checkbox" checked={this.state.allSelected} onChange={(e) => {this.selectAll(e.target.checked);}}/>
                    ]
                },
                cell: {
                    formatters: [
                        (data, {rowData}) => <input className="selectRow" type="checkbox" checked={this.state.selectedIDs.indexOf(rowData.id) !== -1} onChange={(e) => {this.selectRow(rowData.id, e.target.checked);}}/>
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
                                    {doesOverride ? Locale.getMessage("featureSwitchAdmin.overridesYes") : Locale.getMessage("featureSwitchAdmin.overridesNo") }
                                </span>);
                        }

                    ]
                }
            }
        ];
    }

    /**
     * load switches if necessary (i.e. we loaded this page from a bookmark) then
     * use the overrides from the current switch ID (from the URL)
     */
    componentWillMount() {

        if (this.props.switches.length === 0) {
            this.props.getSwitches().then(() => {
                this.props.setFeatureSwitchOverrides(this.props.params.id);
            });
        } else {
            this.props.setFeatureSwitchOverrides(this.props.params.id);
        }
    }
    checkAccess(props) {
        if (props.errorStatus === constants.HttpStatusCode.FORBIDDEN) {
            WindowLocationUtils.update("/qbase/forbidden");
        }
    }
    componentWillReceiveProps(props) {
        this.checkAccess(props);
    }
    /**
     * get switches whenever the component mounts
     */
    componentDidMount() {
        this.checkAccess(this.props);
        this.props.getSwitches();
    }

    render() {

        let featureSwitch = this.props.switches.find((item) => item.id === this.props.params.id);

        if (featureSwitch) {

            const selectedSize = this.state.selectedIDs.length;
            const selectedSizeLabel = selectedSize > 0 && `${selectedSize} ${Locale.getMessage("featureSwitchAdmin.selectedOverrides")}`;
            const loaded = this.props.errorStatus === constants.HttpStatusCode.OK;
            return (
                <Loader loaded={loaded}>
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
                            <button className="addButton" onClick={this.createOverride}><I18nMessage message="featureSwitchAdmin.addNew"/></button>
                        </div>

                        {this.props.overrides.length === 0 ?
                            <h4><I18nMessage message="featureSwitchAdmin.noOverrides"/></h4> :
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
                            <button className="deleteButton" disabled={!selectedSize} onClick={this.confirmDelete}><I18nMessage message="featureSwitchAdmin.delete"/></button>
                            <button className="turnOnButton" disabled={!selectedSize} onClick={() => this.setSelectedOverrideStates(true)}><I18nMessage message="featureSwitchAdmin.turnOn"/></button>
                            <button className="turnOffButton" disabled={!selectedSize} onClick={() => this.setSelectedOverrideStates(false)}><I18nMessage message="featureSwitchAdmin.turnOff"/></button>
                            <span>{selectedSizeLabel}</span>
                        </div>

                        {this.getConfirmDialog()}

                        <PageTitle title={[Locale.getMessage('featureSwitchAdmin.featureSwitchOverridesTitle'), featureSwitch[FeatureSwitchConsts.FEATURE_NAME_KEY]].join(Locale.getMessage('pageTitles.pageTitleSeparator'))} />
                    </div>
                </Loader>
            );
        } else {
            return false;
        }
    }
}


const mapStateToProps = (state) => {

    return {
        switches: state.featureSwitches.switches,
        overrides: state.featureSwitches.overrides,
        errorStatus: state.featureSwitches.errorStatus
    };
};

export default connect(
    mapStateToProps,
    FeatureSwitchActions
)(FeatureSwitchOverridesRoute);
