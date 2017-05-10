import React, {PropTypes} from 'react';
import Locales from "../../locales/locales";
import TextFieldValueEditor from './textFieldValueEditor';
import QBModal from '../qbModal/qbModal';

/**
 * # LinkToRecordFieldValueEditor
 *
 * A placeholder for link to record fields
 *
 */
const LinkToRecordFieldValueEditor = React.createClass({
    displayName: 'LinkToRecordFieldValueEditor',
    propTypes: {

        value: PropTypes.string,

        onBlur: PropTypes.func,

        /**
         * A boolean to disabled field on form builder
         */
        isDisabled: React.PropTypes.bool,

        /** Optional prop to pass in placeholder text. Defaults to: 'name@domain.com' (internationalized). */
        placeholder: PropTypes.string
    },
    getDefaultProps() {
        return {
            value: ''
        };
    },
    onBlur(updatedValues) {
        // Format the displayed url before passing up to the parent
        //updatedValues.display = UrlFileAttachmentReportLinkFormatter.format(updatedValues, (this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : null));
        //if (this.props.onBlur) {
        //    this.props.onBlur(updatedValues);
        //}
    },
    render() {
        let {value, display, onBlur, placeholder, ...otherProps} = this.props;

        return (<QBModal
            show={true}
            primaryButtonName={"do it"}
            primaryButtonOnClick={()=>{}}

            title="Pick some stuff first"
            type="standard"/>);
        // return <TextFieldValueEditor inputType="text"
        //                              value={value}
        //                              placeholder={(this.props.placeholder || Locales.getMessage('placeholder.url'))}
        //                              onBlur={this.onBlur}
        //                              showClearButton={!this.props.isDisabled}
        //                              {...otherProps} />;
    }
});

export default LinkToRecordFieldValueEditor;
