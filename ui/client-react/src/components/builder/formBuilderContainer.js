import React, {PropTypes, Component} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {connect} from 'react-redux';
import * as formActions from '../../actions/formActions';
import {updateFormAnimationState} from '../../actions/animationActions';
import Loader from 'react-loader';
import {LARGE_BREAKPOINT} from "../../constants/spinnerConfigurations";
import {NEW_FORM_RECORD_ID} from '../../constants/schema';
import ToolPalette from './builderMenus/toolPalette';
import FieldProperties from './builderMenus/fieldProperties';
import QbForm from '../QBForm/qbform';
import DraggableField from '../formBuilder/draggableField';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import NavigationUtils from '../../utils/navigationUtils';
import AutoScroll from '../autoScroll/autoScroll';
import PageTitle from '../pageTitle/pageTitle';
import {getFormByContext, getFormRedirectRoute, getSelectedFormElement} from '../../reducers/forms';
import {ENTER_KEY, SPACE_KEY} from '../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import * as tabIndexConstants from '../formBuilder/tabindexConstants';
import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
import _ from 'lodash';
import {DragDropContext} from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import BuilderCustomDragLayer from '../../../../reuse/client/src/components/dragAndDrop/builderCustomDragLayer';
import {HideAppModal} from '../qbModal/appQbModalFunctions';
import AppQbModal from '../qbModal/appQbModal';
import {CONTEXT} from '../../actions/context';

import './formBuilderContainer.scss';

let formBuilderContainerContent = null;

/**
 * This is a ref to the FormBuilder container. A few subcomponents need to access this ref.
 * We don't want to store this in Redux because it is a large object and is not serializable which may cause issues:
 * http://redux.js.org/docs/faq/OrganizingState.html#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
 *
 * This function can be imported to those components that need access to the ref.
 */
export const getFormBuilderContainerContent = () => formBuilderContainerContent || {};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);

    return {
        currentForm,
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : undefined),
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined),
        redirectRoute: getFormRedirectRoute(state),
        formBuilderChildrenTabIndex: (_.has(currentForm, 'formBuilderChildrenTabIndex') ? currentForm.formBuilderChildrenTabIndex[0] : "-1"),
        toolPaletteChildrenTabIndex: (_.has(currentForm, 'toolPaletteChildrenTabIndex') ? currentForm.toolPaletteChildrenTabIndex[0] : "-1"),
        formFocus: (_.has(currentForm, 'formFocus') ? currentForm.formFocus[0] : undefined),
        toolPaletteFocus: (_.has(currentForm, 'toolPaletteFocus') ? currentForm.toolPaletteFocus[0] : undefined),
        isOpen: state.builderNav.isNavOpen,
        isCollapsed: state.builderNav.isNavCollapsed,
        newRelationshipFieldIds: state.relationshipBuilder.newRelationshipFieldIds,
        fields: state.fields
    };
};

const mapDispatchToProps = {
    loadForm: formActions.loadForm,
    moveFieldOnForm: formActions.moveFieldOnForm,
    updateForm: formActions.updateForm,
    toggleFormBuilderChildrenTabIndex: formActions.toggleFormBuilderChildrenTabIndex,
    toggleToolPaletteChildrenTabIndex: formActions.toggleToolPaletteChildrenTabIndex,
    keyboardMoveFieldUp: formActions.keyboardMoveFieldUp,
    keyboardMoveFieldDown: formActions.keyboardMoveFieldDown,
    selectFieldOnForm: formActions.selectFieldOnForm,
    deselectField: formActions.deselectField,
    removeFieldFromForm: formActions.removeFieldFromForm,
    updateFormAnimationState
};

/**
 * A container component that holds the FormBuilder.
 * FormBuilderContainer is rendered by ReactRouter and has access to location and match.params
 * @type {*}
 */
export class FormBuilderContainer extends Component {
    static propTypes = {
        // Three props typically received from the router
        app: PropTypes.object,
        appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        /**
         * A route that will be redirected to after a save/cancel action. Currently passed through mapState. */
        redirectRoute: PropTypes.string,

        /**
         * Controls the open state of the left tool panel */
        isOpen: PropTypes.bool,

        /**
         * Controls the collapsed state of the left tool panel */
        isCollapsed: PropTypes.bool,

        /**
         * newly added (unsaved) link-to-parent field IDs
         */
        newRelationshipFieldIds: PropTypes.array
    };

    static defaultProps = {
        // For easier unit tests without the Router, we can pass in default empty values
        location: {query: {}},
        match: {params: {}},
        showCustomDragLayer: true
    };

    componentDidMount() {
        const {appId, tblId} = this.props.match.params;
        const formType = _.get(this.props, 'location.query.formType');

        // We use the NEW_FORM_RECORD_ID so that the form does not load any record data
        this.props.loadForm(appId, tblId, null, (formType || 'view'), NEW_FORM_RECORD_ID);
    }

    closeFormBuilder = () => {
        const {appId, tblId} = this.props.match.params;

        NavigationUtils.goBackToLocationOrTable(appId, tblId, this.props.redirectRoute);
    };

    onCancel = () => {
        this.closeFormBuilder();
    };

    removeField = () => {
        const {appId, tblId} = this.props.match.params;

        if (this.props.removeFieldFromForm) {
            return this.props.removeFieldFromForm(this.props.currentForm.id, appId, tblId, this.props.selectedField);
        }
    };

    saveClicked = () => {
        HideAppModal();
        // get the form meta data from the store..hard code offset for now...this is going to change..
        if (this.props.currentForm && this.props.currentForm.formData) {
            let formMeta = this.props.currentForm.formData.formMeta;
            let formType = this.props.currentForm.id;
            this.props.updateForm(formMeta.appId, formMeta.tableId, formType, formMeta, this.props.redirectRoute);
        }
    };

    getRightAlignedButtons = () => (
        <div>
            <Button tabIndex={tabIndexConstants.CANCEL_BUTTON_TABINDEX} bsStyle="primary" onClick={this.onCancel} className="alternativeTrowserFooterButton"><I18nMessage message="nav.cancel"/></Button>
            <Button tabIndex={tabIndexConstants.SAVE_BUTTON_TABINDEX} bsStyle="primary" onClick={this.saveClicked} className="mainTrowserFooterButton"><I18nMessage message="nav.save"/></Button>
        </div>
    );

    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions = () => (
            <div className={"centerActions"} />
    );


    getSaveOrCancelFooter = () => (
        <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAlignedButtons={this.getTrowserActions()}
            leftAlignedButtons={this.getTrowserActions()}
        />
    );

    updateChildrenTabIndex = (e) => {
        let childrenTabIndex = this.props.formBuilderChildrenTabIndex;

        if ((e.which === ENTER_KEY || e.which === SPACE_KEY) && childrenTabIndex !== tabIndexConstants.FORM_TAB_INDEX) {
            this.props.toggleFormBuilderChildrenTabIndex(this.props.currentForm.id, childrenTabIndex);
        }
    };

    keyboardMoveFieldUp = () => {
        if (this.props.selectedField.elementIndex !== 0) {
            this.props.keyboardMoveFieldUp(this.props.currentForm.id, this.props.selectedField);
        }
    };

    keyboardMoveFieldDown = () => {
        let {tabIndex, sectionIndex, columnIndex} = this.props.selectedField;
        let formDataLength = this.props.currentForm.formData.formMeta.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].elements.length - 1;
        if (this.props.selectedField.elementIndex < formDataLength) {
            this.props.keyboardMoveFieldDown(this.props.currentForm.id, this.props.selectedField);
        }
    };

    escapeCurrentContext = () => {
        let selectedField = this.props.selectedField;
        let formId = this.props.currentForm.id;

        if (this.props.formBuilderChildrenTabIndex === tabIndexConstants.FORM_TAB_INDEX) {
            if (this.props.toggleFormBuilderChildrenTabIndex) {
                this.props.toggleFormBuilderChildrenTabIndex(formId, tabIndexConstants.FORM_TAB_INDEX);
            }
        } else if (this.props.toolPaletteChildrenTabIndex === tabIndexConstants.TOOL_PALETTE_TABINDEX) {
            if (this.props.toggleToolPaletteChildrenTabIndex) {
                this.props.toggleToolPaletteChildrenTabIndex(formId, tabIndexConstants.TOOL_PALETTE_TABINDEX);
            }
        } else if (selectedField) {
            if (this.props.deselectField) {
                this.props.deselectField(this.props.currentForm.id, this.props.selectedField);
            }
        } else {
            this.onCancel();
        }
    };

    toggleToolPaletteChildrenTabIndex = (e) => {
        let formId = this.props.currentForm.id;
        if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
            this.props.toggleToolPaletteChildrenTabIndex(formId, "-1");
            e.preventDefault();
        }
    };

    /**
     * This is for keyboard navigation, it will add focus to a form only if formFocus is true
     * formFocus becomes true when a user is hitting escape to remove the children elements form the tabbing flow
     * */
    componentDidUpdate() {
        if (this.props.formFocus &&
            document.activeElement.classList[0] !== "checkbox" &&
            document.activeElement.tagName !== "TEXTAREA" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "BUTTON") {
            formBuilderContainerContent.focus();
        }
    }

    setFormBuilderContainerRef = element => formBuilderContainerContent = element;

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
                {/* AppQbModal is an app-wide modal that can be called from non-react classes*/}
                <AppQbModal/>
                <BuilderCustomDragLayer />
                <KeyboardShortcuts id="formBuilderContainer"
                                   shortcutBindings={[
                                       {key: 'shift+up', callback: () => {this.keyboardMoveFieldUp(); return false;}},
                                       {key: 'shift+down', callback: () => {this.keyboardMoveFieldDown(); return false;}},
                                       {key: 'shift+backspace', callback: () => {this.removeField(); return false;}},
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
                             toolPaletteFocus={this.props.toolPaletteFocus}
                             formMeta={formData ? formData.formMeta : null}
                             app={this.props.app}
                             appId={this.props.appId}
                             tableId={this.props.tableId}
                             newRelationshipFieldIds={this.props.newRelationshipFieldIds}
                             fields={this.props.fields}
                >
                    <FieldProperties appId={this.props.match.params.appId} app={this.props.app} tableId={this.props.match.params.tblId} formId={formId}>
                        <div tabIndex={tabIndexConstants.FORM_TAB_INDEX}
                             className="formBuilderContainerContent"
                             ref={this.setFormBuilderContainerRef}
                             role="button"
                             onKeyDown={this.updateChildrenTabIndex}>
                            <AutoScroll parentContainer={formBuilderContainerContent} pixelsFromBottomForLargeDevices={100}>
                                <div className="formBuilderContent">
                                    <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                                        <div className="formBuilderContainer">
                                            <QbForm
                                                alternateFieldRenderer={DraggableField}
                                                formFocus={this.props.formFocus}
                                                formBuilderUpdateChildrenTabIndex={this.props.formBuilderUpdateChildrenTabIndex}
                                                edit={true}
                                                editingForm={true}
                                                formData={formData}
                                                hasAnimation={true}
                                                app={this.props.app}
                                                tblId={this.props.match.params.tblId}
                                                appUsers={[]}
                                                formId={formId}
                                            />
                                        </div>
                                    </Loader>
                                </div>
                            </AutoScroll>
                        </div>
                    </FieldProperties>
                </ToolPalette>
                {this.getSaveOrCancelFooter()}
            </div>
        );
    }
}

export default
    DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(
    connect(mapStateToProps, mapDispatchToProps)(FormBuilderContainer));
