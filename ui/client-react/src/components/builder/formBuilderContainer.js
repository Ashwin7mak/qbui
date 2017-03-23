import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {connect} from 'react-redux';
import {loadForm, updateForm, moveFieldOnForm, removeFieldFromForm} from '../../actions/formActions';
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
import {NotificationManager} from 'react-notifications';

import './formBuilderContainer.scss';

let logger = new Logger();

const mapStateToProps = state => {
    return {
        forms: state.forms,
        notifyTableCreated: state.tableCreation.notifyTableCreated
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

        removeField(formId, location) {
            return dispatch(removeFieldFromForm(formId, location));
        },

        updateAnimationState(isAnimating) {
            return dispatch(updateFormAnimationState(isAnimating));
        },

        tableCreatedNotificationComplete() {
            return dispatch(notifyTableCreated(false));
        }
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

        // if we've been sent here from the table creation flow, show a notification

        if (this.props.notifyTableCreated) {
            this.props.tableCreatedNotificationComplete();
            setTimeout(() => {
                NotificationManager.success(Locale.getMessage('tableCreation.tableCreated'), Locale.getMessage('success'));
            }, 1000);
        }
    },

    onCancel() {
        AppHistory.history.goBack();
    },

    saveClicked() {
        // get the form meta data from the store..hard code offset for now...this is going to change..
        if (this.props.forms && this.props.forms.length > 0 && this.props.forms[0].formData) {
            let formMeta = this.props.forms[0].formData.formMeta;
            let formType = this.props.forms[0].formData.formType;
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

    render() {

        let loaded = (_.has(this.props, 'forms') && this.props.forms.length > 0 && !this.props.forms[0].loading);
        let formData = null;
        let formId = null;
        if (loaded) {
            formId = this.props.forms[0].id;
            formData = this.props.forms[0].formData;
        }
        return (
            <div className="formBuilderContainer">
                <PageTitle title={Locale.getMessage('pageTitles.editForm')}/>

                <div className="toolsAndForm">
                    <ToolPalette />

                    <AutoScroll
                        pixelsFromBottomForLargeDevices={80}
                        pixelsFromBottomForMobile={50}>
                        <div className="formBuilderContent">
                            <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                                <FormBuilder
                                    formId={formId}
                                    formData={formData}
                                    moveFieldOnForm={this.props.moveField}
                                    removeField={this.props.removeField}
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
