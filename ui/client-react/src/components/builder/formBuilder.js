import React, {PropTypes} from 'react';
import './formBuilder.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter'


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
    //Do we want this? pulled from trowser.js
    // handleKey(e) {
    //     // close trowser when Esc is pressed
    //     if (this.props.visible && e.key === 'Escape') {
    //         this.props.onCancel();
    //     }
    // },
    render() {

        return (
            <div className="formBuilderContainer">
                <div className="formBuilderBody">
                    <h1 className="formBuilderHeader">Welcome To Form Builder</h1>
                    <div> <b>appId:</b> {this.props.params.appId} </div>
                    <div> <b>tblId:</b> {this.props.params.tblId} </div>
                    <div> <b>formId:</b> {this.props.formId} </div>
                    <div> <b>formType:</b>  </div>
                </div>
                {this.props.saveOrCancelFooter}
            </div>
        );
    }
});

export default FormBuilder;
