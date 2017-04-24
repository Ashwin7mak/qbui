import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import FieldToken from './fieldToken';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';
import {addNewFieldToForm} from "../../../actions/formActions";
import {getFormByContext} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';
import {ENTER_KEY, SPACE_KEY} from '../../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import _ from 'lodash';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 * TODO: This will eventually be decorated with other methods like onClick for adding it to the form. */
export class FieldTokenInMenu extends Component {

    clickToAddToForm = () => {
        let {selectedField, formId, appId, tblId, relatedField} = this.props;
        this.props.addNewFieldToForm(formId, appId, tblId, selectedField, relatedField);
    };

    onEnterClickToAdd = (e) => {
        if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
            this.clickToAddToForm();
            e.preventDefault();
        }
    };

    render() {
        const fieldToken = <FieldToken onClick={this.clickToAddToForm} isDragging={false} {...this.props} />;
        if (this.props.tooltipText) {
            return (
                <div tabIndex={this.props.tabIndex}
                     onKeyDown={this.onEnterClickToAdd}>
                    <Tooltip location="right" plainMessage={this.props.tooltipText}>
                        {fieldToken}
                    </Tooltip>
                </div>
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
    isCollapsed: PropTypes.bool,

    /**
     * Tabindex */
    toolPaletteChildrenTabIndex: PropTypes.number
};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);

    return {
        formId: _.get(currentForm, 'id'),
        appId: _.get(currentForm, 'formData.formMeta.appId'),
        tblId: _.get(currentForm, 'formData.formMeta.tableId'),
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : null)
    };
};

const mapDispatchToProps = {
    addNewFieldToForm
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldTokenInMenu);
