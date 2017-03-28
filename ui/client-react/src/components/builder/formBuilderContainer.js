import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {connect} from 'react-redux';
import {loadForm, updateForm, moveFieldOnForm, toggleFormBuilderChildrenTabIndex, keyboardMoveFieldUp, keyboardMoveFieldDown, deselectField, removeFieldFromForm} from '../../actions/formActions';
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
import ReKeyboardShortcuts from '../../../../reuse/client/src/components/reKeyboardShortcuts/reKeyboardShortcuts';
import _ from 'lodash';

import './formBuilderContainer.scss';

let logger = new Logger();

const mapStateToProps = state => {
    let currentForm = state.forms ? state.forms[0] : undefined;

    return {
        currentForm,
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : []),
        tabIndex: (_.has(currentForm, 'formBuilderChildrenTabIndex') ? currentForm.formBuilderChildrenTabIndex[0] : undefined),
        formFocus: (_.has(currentForm, 'formFocus') ? currentForm.formFocus[0] : undefined)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadForm(appId, tableId, reportId, formType, recordId) {
            return dispatch(loadForm(appId, tableId, reportId, formType, recordId));
        },

        moveField(formId, newLocation, draggedItemProps) {
            return dispatch(moveFieldOnForm(formId, newLocation, draggedItemProps));
        },

        updateForm(appId, tblId, formType, form) {
            return dispatch(updateForm(appId, tblId, formType, form));
        },

        updateAnimationState(isAnimating) {
            return dispatch(updateFormAnimationState(isAnimating));
        },

        toggleFormBuilderChildrenTabIndex(formId, currentTabIndex) {
            return dispatch(toggleFormBuilderChildrenTabIndex(formId, currentTabIndex));
        },

        keyboardMoveFieldUp(formId, location) {
            return dispatch(keyboardMoveFieldUp(formId, location));
        },

        keyboardMoveFieldDown(formId, location) {
            return dispatch(keyboardMoveFieldDown(formId, location));
        },

        deselectField(formId, location) {
            return dispatch(deselectField(formId, location));
        },
        removeField(formId, location) {
            return dispatch(removeFieldFromForm(formId, location));
        },
    };
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
    },

    onCancel() {
        AppHistory.history.goBack();
    },

    removeField() {
        if (this.props.removeField) {
            return this.props.removeField(this.props.currentForm.id, this.props.selectedField);
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

        if ((e.which === 13 || e.which === 32) && childrenTabIndex !== "0") {
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

                <ReKeyboardShortcuts id="formBuilderContainer" shortcutBindings={[
                    {key: 'esc', callback: () => {this.escapeCurrentContext(); return false;}},
                    {key: 'mod+s', callback: () => {this.saveClicked(); return false;}},
                    {key: 'shift+up', callback: () => {this.keyboardMoveFieldUp(); return false;}},
                    {key: 'shift+down', callback: () => {this.keyboardMoveFieldDown(); return false;}},
                    {key: 'backspace', callback: () => {this.removeField(); return false;}}
                ]}/>

                <PageTitle title={Locale.getMessage('pageTitles.editForm')}/>

                <div className="toolsAndForm">
                    <ToolPalette />

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
                                    moveFieldOnForm={this.props.moveField}
                                    updateAnimationState={this.props.updateAnimationState}
                                />
                            </Loader>
                        </div>
                    </AutoScroll>

                    <FieldProperties />
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
