import React, {PropTypes} from 'react';

import './formBuilder.scss';


const FormBuilder = React.createClass({
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
    render() {

        return (
            <div className="formBuilder">
                <h1 className="formBuilderHeader">Welcome To Form Builder</h1>
                <div className="formBuilderBody"> <b>appId:</b> {this.props.appId} </div>
                <div className="formBuilderBody"> <b>tblId:</b> {this.props.tblId} </div>
                <div className="formBuilderBody"> <b>formId:</b> {this.props.formId} </div>
                <div className="formBuilderBody"> <b>formType:</b> {this.props.formType} </div>


            </div>
        );
    }
});

export default FormBuilder;

