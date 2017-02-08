import React, {PropTypes} from 'react';
import './formBuilder.scss';


const FormBuilder = React.createClass({
    propTypes: {
        /**
         * the app id
         * */
        appId: React.PropTypes.string,
        /**
         * the table id
         * */
        tblId: React.PropTypes.string,
        /**
         * the form id
         * */
        formId: React.PropTypes.string,
        /**
         * the form type
         * */
        formType: React.PropTypes.string
    },

    render() {

        return (
            <div className="formBuilderContent">
                <div className="formBuilderChildren">
                    <h1 className="formBuilderHeader">Welcome To Form Builder</h1>
                    <div> <b>appId:</b> {this.props.params.appId} </div>
                    <div> <b>tblId:</b> {this.props.params.tblId} </div>
                    <div> <b>formId:</b> {this.props.formId} </div>
                    <div> <b>formType:</b>  </div>
                </div>
            </div>
        );
    }
});

export default FormBuilder;
