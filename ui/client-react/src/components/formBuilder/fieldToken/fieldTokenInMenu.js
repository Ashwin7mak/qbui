import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import FieldToken from './fieldToken';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';
import {addNewFieldToForm} from "../../../actions/formActions";
import {getFormByContext} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 * TODO: This will eventually be decorated with other methods like onClick for adding it to the form. */
export class FieldTokenInMenu extends Component {

    clickToAddToForm = () => {
        let {selectedField, formId, datatypeAttributes} = this.props;

        console.log({...this.props});
        this.props.addNewFieldToForm(formId, selectedField, datatypeAttributes);
    };

    render() {
        const fieldToken = <FieldToken onClick={this.clickToAddToForm} isDragging={false} {...this.props} />;

        if (this.props.tooltipText) {
            return (
                <Tooltip location="right" plainMessage={this.props.tooltipText}>
                    {fieldToken}
                </Tooltip>
            );
        }

        return fieldToken;
    }
}

FieldTokenInMenu.propTypes = {
    /**
     * What field type does this token represent? */
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * What title should be used on the field token? */
    title: PropTypes.string.isRequired,

    /**
     * Text to display in a tooltip. It should be localized. */
    tooltipText: PropTypes.string,

    /**
     * Can optionally show the token in a collapsed state (icon only) */
    isCollapsed: PropTypes.bool
};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);
    return {
        formId: (_.has(currentForm, 'id') ? currentForm.id : null),
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : null),
        state: state.forms
    };
};

const mapDispatchToProps = {
    addNewFieldToForm
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldTokenInMenu);
