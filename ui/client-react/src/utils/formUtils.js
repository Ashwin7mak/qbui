/**
 * Static class of Form Utility functions
 */

class FormUtils {

    /**
     * get the form data
     * @param props component props
     * @param formType "view" or "edit"
     * @returns form data or false if it is not available on the props
     */
    static getFormFromProps(props, formType) {
        return props.qbui && props.qbui.forms && props.qbui.forms[formType] && (props.qbui.forms[formType].length > 0) && props.qbui.forms[formType][0];
    }
}

FormUtils.VIEW = "view";
FormUtils.EDIT = "edit";

export default FormUtils;
