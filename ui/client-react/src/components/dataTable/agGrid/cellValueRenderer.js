import React from 'react';

import _ from 'lodash';
import FieldValueRenderer from '../../fields/fieldValueRenderer';

/**
 *  # CellValueRenderer
 *  Field value in a table cell
 *
 */
const CellValueRenderer = React.createClass({
    displayName: 'CellValueRenderer',

    propTypes: {
        display: React.PropTypes.any,
        value: React.PropTypes.any,
        attributes: React.PropTypes.object,
        isEditable: React.PropTypes.bool,
        type: React.PropTypes.number,
        idKey:  React.PropTypes.any
    },

    render() {

        let classes = "cellData" ;
        // the wrap property effects table cell rendered values only
        // that is, nowrap doesn't apply on forms so we set it when rendering the
        // value for a cell
        // Note for the word_wrap on fields display setting in the temporary ag-grid the cell height won't change though
        // text will wrap, only in qbgrid for single line text field with word_wrap display option true will word_wrap
        // on single line text field behave as expected
        if (_.has(this.props, 'attributes.clientSideAttributes.word_wrap') &&
            !this.props.attributes.clientSideAttributes.word_wrap) {
            classes += ' NoWrap';
        }
        classes += (this.props.isEditable ? "" : " nonEditable");

        return (<FieldValueRenderer classes={classes}
                            display={this.props.display}
                            value={this.props.value}
                            attributes={this.props.attributes}
                            isEditable={this.props.isEditable}
                            type={this.props.type}
                            key={"fvr=-" + this.props.idKey}
                            // Don't show unchecked checkboxes in the grid
                            hideUncheckedCheckbox={true}
                    />);
    }
});

export default CellValueRenderer;
