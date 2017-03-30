import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {connect} from 'react-redux';
import {loadForm, updateForm, moveFieldOnForm, toggleFormBuilderChildrenTabIndex, keyboardMoveFieldUp, keyboardMoveFieldDown, deselectField, removeFieldFromForm} from '../../actions/formActions';
import {notifyTableCreated} from '../../actions/tableCreationActions';
import {updateFormAnimationState} from '../../actions/animationActions';
import Loader from 'react-loader';
import {LARGE_BREAKPOINT} from "../../constants/spinnerConfigurations";
import {NEW_FORM_RECORD_ID} from '../../constants/schema';
import ToolPalette from './builderMenus/toolPalette';
import FieldProperties from './builderMenus/fieldProperties';
import FormBuilder from '../formBuilder/formBuilder';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import AppHistory from '../../globals/appHistory';
import Logger from '../../utils/logger';
import AutoScroll from '../autoScroll/autoScroll';
import PageTitle from '../pageTitle/pageTitle';
import {ENTER_KEY, SPACE_KEY} from '../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
import _ from 'lodash';
import NotificationManager from '../../../../reuse/client/src/scripts/notificationManager';

import './formBuilderContainer.scss';

let logger = new Logger();

const mapStateToProps = state => {
    let currentForm = state.forms ? state.forms[0] : undefined;

    return {
        currentForm,
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : []),
        tabIndex: (_.has(currentForm, 'formBuilderChildrenTabIndex') ? currentForm.formBuilderChildrenTabIndex[0] : undefined),
        formFocus: (_.has(currentForm, 'formFocus') ? currentForm.formFocus[0] : undefined),
        shouldNotifyTableCreated: state.tableCreation.notifyTableCreated
    };
};

const mapDispatchToProps = {
    loadForm,
    moveFieldOnForm,
    updateForm,
    updateFormAnimationState,
    toggleFormBuilderChildrenTabIndex,
    keyboardMoveFieldUp,
    keyboardMoveFieldDown,
    deselectField,
    removeFieldFromForm,
    notifyTableCreated
};

export const FormBuilderContainer = React.createClass({
    propTypes: {
        /**
         * the app id
         * */
        appId: PropTypes.string,
        /**
         * the table id
         * */
        tblId: PropTypes.string,
        /**
         * the form id
         * */
        formId: PropTypes.string,
        /**
         * the form type
         * */
        formType: PropTypes.string
    },

    componentDidMount() {
        // We use the NEW_FORM_RECORD_ID so that the form does not load any record data
        this.props.loadForm(this.props.appId, this.props.tblId, null, (this.props.formType || 'view'), NEW_FORM_RECORD_ID);

        // if we've been sent here from the table creation flow, show a notification

        if (this.props.shouldNotifyTableCreated) {
            this.props.notifyTableCreated(false);
            setTimeout(() => {
                NotificationManager.success(Locale.getMessage('tableCreation.tableCreated'), Locale.getMessage('success'));
            }, 1000);
        }
    },

    onCancel() {
        AppHistory.history.goBack();
    },

    removeField() {
        if (this.props.removeFieldFromForm) {
            return this.props.removeFieldFromForm(this.props.currentForm.id, this.props.selectedField);
        }
    },

    saveClicked() {
        // get the form meta data from the store..hard code offset for now...this is going to change..
        if (this.props.currentForm && this.props.currentForm.formData) {
            let formMeta = this.props.currentForm.formData.formMeta;
            let formType = this.props.currentForm.formData.formType;
            this.props.updateForm(formMeta.appId, formMeta.tableId, formType, formMeta);
        }
    },

    getRightAlignedButtons() {
        return (
            <div>
                <Button bsStyle="primary" onClick={this.onCancel} className="cancelFormButton"><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.saveClicked} className="saveFormButton"><I18nMessage message="nav.save"/></Button>
            </div>
        );
    },

    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    },

    getSaveOrCancelFooter() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAlignedButtons={this.getTrowserActions()}
            leftAlignedButtons={this.getTrowserActions()}
        />;
    },

    updateChildrenTabIndex(e) {
        let childrenTabIndex = this.props.tabIndex;

        if ((e.which === ENTER_KEY || e.which === SPACE_KEY) && childrenTabIndex !== "0") {
            this.props.toggleFormBuilderChildrenTabIndex(this.props.currentForm.id, childrenTabIndex);
            e.preventDefault();
        }
    },

    keyboardMoveFieldUp() {
        if (this.props.selectedField.elementIndex !== 0) {
            this.props.keyboardMoveFieldUp(this.props.currentForm.id, this.props.selectedField);
        }
    },

    keyboardMoveFieldDown() {
        if (this.props.selectedField && this.props.selectedField.elementIndex < this.props.currentForm.formData.formMeta.fields.length - 1) {
            this.props.keyboardMoveFieldDown(this.props.currentForm.id, this.props.selectedField);
        }
    },

    deselectField() {
        if (this.props.deselectField) {
            this.props.deselectField(this.props.currentForm.id, this.props.selectedField);
        }
    },

    escapeCurrentContext() {
        let childrenTabIndex = this.props.tabIndex;
        let selectedField = this.props.selectedField;
        if (selectedField) {
            this.deselectField();
        } else if (this.props.tabIndex === "0") {
            this.props.toggleFormBuilderChildrenTabIndex(this.props.currentForm.id, childrenTabIndex);
        } else {
            this.onCancel();
        }
    },

    render() {
        let loaded = (_.has(this.props, 'currentForm') && this.props.currentForm !== undefined && !this.props.currentForm.loading);
        let formData = null;
        let formId = null;
        if (loaded) {
            formId = this.props.currentForm.id;
            formData = this.props.currentForm.formData;
        }
        return (
            <div className="formBuilderContainer">

                <KeyboardShortcuts id="formBuilderContainer" shortcutBindings={[
                    {key: 'esc', callback: () => {this.escapeCurrentContext(); return false;}},
                    {key: 'mod+s', callback: () => {this.saveClicked(); return false;}},
                    {key: 'shift+up', callback: () => {this.keyboardMoveFieldUp(); return false;}},
                    {key: 'shift+down', callback: () => {this.keyboardMoveFieldDown(); return false;}},
                    {key: 'backspace', callback: () => {this.removeField(); return false;}}
                ]}/>

                <PageTitle title={Locale.getMessage('pageTitles.editForm')}/>

                <div className="toolsAndForm">
                    <ToolPalette>
                        <AutoScroll
                            pixelsFromBottomForLargeDevices={80}
                            pixelsFromBottomForMobile={50}>
                            <div className="formBuilderContent">
                                <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                                    <FormBuilder
                                        formFocus={this.props.formFocus}
                                        selectedField={this.props.selectedField}
                                        formBuilderUpdateChildrenTabIndex={this.updateChildrenTabIndex}
                                        formId={formId}
                                        formData={formData}
                                        moveFieldOnForm={this.props.moveFieldOnForm}
                                        updateAnimationState={this.props.updateFormAnimationState}
                                    />
                                </Loader>
                            </div>
                        </AutoScroll>

                        <FieldProperties />
                    </ToolPalette>
                </div>

                {this.getSaveOrCancelFooter()}
            </div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderContainer);
