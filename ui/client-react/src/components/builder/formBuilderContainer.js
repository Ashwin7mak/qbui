import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {loadForm} from '../../actions/formActions';
import Loader from 'react-loader';
import {LARGE_BREAKPOINT_REPORT} from "../../constants/spinnerConfigurations";
import {NEW_FORM_RECORD_ID} from '../../constants/schema';

import FormBuilder from '../formBuilder/formBuilder';

import './formBuilderContainer.scss';

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
    render() {
        let loaded = (this.props.forms && this.props.forms.length > 0 && !this.props.forms[0].loading);

        let formData = null;
        if (loaded) {
            formData = this.props.forms[0].formData;
        }

        return (
                <div className="formBuilder">
                    <h1 className="formBuilderHeader">Welcome To Form Builder</h1>
                    <div className="formBuilderBody">
                        <b>appId:</b> {this.props.appId} |
                        <b> tblId:</b> {this.props.tblId} |
                        <b> formId:</b> {this.props.formId || 'not specified'} |
                        <b> formType:</b> {this.props.formType|| 'not specified'}
                    </div>

                    <Loader loaded={loaded} options={LARGE_BREAKPOINT_REPORT}>
                        <FormBuilder formData={formData} />
                    </Loader>
                </div>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilderContainer);
