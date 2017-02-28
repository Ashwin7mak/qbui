import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import {connect} from 'react-redux';
import {loadForm, updateForm, moveFieldOnForm} from '../../actions/formActions';
import Loader from 'react-loader';
import {LARGE_BREAKPOINT} from "../../constants/spinnerConfigurations";
import {NEW_FORM_RECORD_ID} from '../../constants/schema';
import ToolPalette from './builderMenus/toolPalette';
import FieldProperties from './builderMenus/fieldProperties';
import FormBuilder from '../formBuilder/formBuilder';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import AppHistory from '../../globals/appHistory';
import Logger from '../../utils/logger';
import './formBuilderContainer.scss';
import AutoScroll from '../autoScroll/autoScroll';

let logger = new Logger();

const mapStateToProps = state => {
    return {
        forms: state.forms
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
                <div className="toolsAndForm">
                    <ToolPalette />

                <AutoScroll>
                    <div className="formBuilderContent">
                        <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                            <FormBuilder formId={formId} formData={formData} moveFieldOnForm={this.props.moveField} />
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
