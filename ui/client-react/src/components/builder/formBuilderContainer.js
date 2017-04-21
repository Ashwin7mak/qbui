import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {connect} from 'react-redux';
import {loadForm, updateForm, moveFieldOnForm, toggleFormBuilderChildrenTabIndex, toggleToolPaletteChildrenTabIndex, keyboardMoveFieldUp, keyboardMoveFieldDown, deselectField, removeFieldFromForm} from '../../actions/formActions';
import {notifyTableCreated} from '../../actions/tableCreationActions';
import {updateFormAnimationState} from '../../actions/animationActions';
import Loader from 'react-loader';
import {LARGE_BREAKPOINT} from "../../constants/spinnerConfigurations";
import {NEW_FORM_RECORD_ID} from '../../constants/schema';
import ToolPalette from './builderMenus/toolPalette';
import FieldProperties from './builderMenus/fieldProperties';
import FormBuilder from '../formBuilder/formBuilder';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import NavigationUtils from '../../utils/navigationUtils';
import Logger from '../../utils/logger';
import AutoScroll from '../autoScroll/autoScroll';
import PageTitle from '../pageTitle/pageTitle';
import {getFormByContext, getFormRedirectRoute} from '../../reducers/forms';
import {CONTEXT} from '../../actions/context';
import {ENTER_KEY, SPACE_KEY} from '../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import * as tabIndexConstants from '../formBuilder/tabindexConstants';
import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
import _ from 'lodash';
import NotificationManager from '../../../../reuse/client/src/scripts/notificationManager';

import './formBuilderContainer.scss';

let logger = new Logger();
let formBuilderContainerContent = null;

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);

    return {
        currentForm,
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : undefined),
        redirectRoute: getFormRedirectRoute(state),
        formBuilderChildrenTabIndex: (_.has(currentForm, 'formBuilderChildrenTabIndex') ? currentForm.formBuilderChildrenTabIndex[0] : "-1"),
        toolPaletteChildrenTabIndex: (_.has(currentForm, 'toolPaletteChildrenTabIndex') ? currentForm.toolPaletteChildrenTabIndex[0] : "-1"),
        formFocus: (_.has(currentForm, 'formFocus') ? currentForm.formFocus[0] : undefined),
        toolPaletteFocus: (_.has(currentForm, 'toolPaletteFocus') ? currentForm.toolPaletteFocus[0] : undefined),
        shouldNotifyTableCreated: state.tableCreation.notifyTableCreated,
        isOpen: state.builderNav.isNavOpen,
        isCollapsed: state.builderNav.isNavCollapsed
    };
};

const mapDispatchToProps = {
    loadForm,
    moveFieldOnForm,
    updateForm,
    updateFormAnimationState,
    toggleFormBuilderChildrenTabIndex,
    toggleToolPaletteChildrenTabIndex,
    keyboardMoveFieldUp,
    keyboardMoveFieldDown,
    deselectField,
    removeFieldFromForm,
    notifyTableCreated
};

/**
 * A container component that holds the FormBuilder.
 * FormBuilderContainer is rendered by ReactRouter and has access to location and match.params
 * @type {*}
 */
export const FormBuilderContainer = React.createClass({
    propTypes: {
        match: PropTypes.shape({
            params: PropTypes.shape({
                /**
                 * the app id */
                appId: PropTypes.string,

                /**
                 * the table id */
                tblId: PropTypes.string,

                /**
                 * the form id */
                formId: PropTypes.string,
            })
        }),

        location: PropTypes.shape({
            query: PropTypes.shape({
                /**
                 * the form type */
                formType: PropTypes.string,
            })
        }),

        /**
         * A route that will be redirected to after a save/cancel action. Currently passed through mapState. */
        redirectRoute: PropTypes.string,

        /**
         * Controls the open state of the left tool panel */
        isOpen: PropTypes.bool,

        /**
         * Controls the collapsed state of the left tool panel */
        isCollapsed: PropTypes.bool
    },

    getDefaultProps() {
        // For easier unit tests without the Router, we can pass in default empty values
        return {
            location: {query: {}},
            match: {params: {}}
        };
    },

    componentDidMount() {
        const {appId, tblId} = this.props.match.params;
        const formType = _.get(this.props, 'location.query.formType');

        // We use the NEW_FORM_RECORD_ID so that the form does not load any record data
        this.props.loadForm(appId, tblId, null, (formType || 'view'), NEW_FORM_RECORD_ID);

        // if we've been sent here from the table creation flow, show a notification
        if (this.props.shouldNotifyTableCreated) {
            this.props.notifyTableCreated(false);
            setTimeout(() => {
                NotificationManager.success(Locale.getMessage('tableCreation.tableCreated'), Locale.getMessage('success'));
            }, 1000);
        }
    },

    onCancel() {
        const {appId, tblId} = this.props.match.params;

        NavigationUtils.goBackToLocationOrTable(appId, tblId, this.props.redirectRoute);
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
            let formType = this.props.currentForm.id;
            this.props.updateForm(formMeta.appId, formMeta.tableId, formType, formMeta, this.props.redirectRoute);
        }
    },

    getRightAlignedButtons() {
        return (
            <div>
                <Button tabIndex={tabIndexConstants.cancelButtonTabIndex} bsStyle="primary" onClick={this.onCancel} className="cancelFormButton"><I18nMessage message="nav.cancel"/></Button>
                <Button tabIndex={tabIndexConstants.saveButtonTabIndex} bsStyle="primary" onClick={this.saveClicked} className="saveFormButton"><I18nMessage message="nav.save"/></Button>
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
        let childrenTabIndex = this.props.formBuilderChildrenTabIndex;

        if ((e.which === ENTER_KEY || e.which === SPACE_KEY) && childrenTabIndex !== tabIndexConstants.formTabIndex) {
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
        let {tabIndex, sectionIndex, columnIndex} = this.props.selectedField;
        let formDataLength = this.props.currentForm.formData.formMeta.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].elements.length - 1;

        if (this.props.selectedField.elementIndex < formDataLength) {
            this.props.keyboardMoveFieldDown(this.props.currentForm.id, this.props.selectedField);
        }
    },

    deselectField() {
        if (this.props.deselectField) {
            this.props.deselectField(this.props.currentForm.id, this.props.selectedField);
        }
    },

    escapeCurrentContext() {
        let childrenTabIndex = this.props.formBuilderChildrenTabIndex;
        let selectedField = this.props.selectedField;
        let formId = this.props.currentForm.id;
        if (this.props.formBuilderChildrenTabIndex === tabIndexConstants.formTabIndex) {
            this.props.toggleFormBuilderChildrenTabIndex(formId, childrenTabIndex);
        } else if (this.props.toolPaletteChildrenTabIndex === tabIndexConstants.toolPaletteTabIndex) {
            this.props.toggleToolPaletteChildrenTabIndex(formId, tabIndexConstants.toolPaletteTabIndex);
        } else if (selectedField) {
            this.deselectField();
        } else {
            this.onCancel();
        }
    },

    toggleToolPaletteChildrenTabIndex(e) {
        //Test, will need to update to actually changing only tool palette children
        let formId = this.props.currentForm.id;
        if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
            this.props.toggleToolPaletteChildrenTabIndex(formId, "-1");
        }
    },

    render() {
        let loaded = (_.has(this.props, 'currentForm') && this.props.currentForm !== undefined && !this.props.currentForm.loading && !this.props.currentForm.saving);
        let formData = null;
        let formId = null;
        if (loaded) {
            formId = this.props.currentForm.id;
            formData = this.props.currentForm.formData;
        }

        return (
            <div className="formBuilderContainer">
                <KeyboardShortcuts id="formBuilderContainer"
                                   shortcutBindings={[
                                       {key: 'shift+up', callback: () => {this.keyboardMoveFieldUp(); return false;}},
                                       {key: 'shift+down', callback: () => {this.keyboardMoveFieldDown(); return false;}},
                                       {key: 'backspace', callback: () => {this.removeField(); return false;}},
                                   ]}
                                   shortcutBindingsPreventDefault={[
                                       {key: 'esc', callback: () => {this.escapeCurrentContext(); return false;}},
                                       {key: 'mod+s', callback: () => {this.saveClicked(); return false;}},
                                   ]}/>

                <PageTitle title={Locale.getMessage('pageTitles.editForm')}/>

                <ToolPalette isCollapsed={this.props.isCollapsed}
                             isOpen={this.props.isOpen}
                             toggleToolPaletteChildrenTabIndex={this.toggleToolPaletteChildrenTabIndex}
                             toolPaletteChildrenTabIndex={this.props.toolPaletteChildrenTabIndex}
                             toolPaletteFocus={this.props.toolPaletteFocus} >
                <FieldProperties appId={this.props.match.params.appId} tableId={this.props.match.params.tblId} formId={formId}>
                        <div className="formBuilderContainerContent" ref={element => formBuilderContainerContent = element}>
                            <AutoScroll parentContainer={formBuilderContainerContent} pixelsFromBottomForLargeDevices={100}>
                                <div className="formBuilderContent">
                                    <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                                        <FormBuilder
                                            formBuilderContainerContentElement={formBuilderContainerContent}
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
                            {this.getSaveOrCancelFooter()}
                        </div>
                    </FieldProperties>
                </ToolPalette>
            </div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderContainer);
