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
        type: React.PropTypes.number
    },

    render() {

        let classes = "cellData" ;
        // the wrap property effects table cell rendered values only
        // that is, nowrap doesn't apply on forms so we set it when rendering the
        // value for a cell
        if (_.has(this.props, 'this.props.attributes.clientSideAttributes.word-wrap') &&
            !this.props.attributes.clientSideAttributes.word_wrap) {
            classes += ' NoWrap';
        }
        return (<FieldValueRenderer classes={classes}
                            display={this.props.display}
                            value={this.props.value}
                            attributes={this.props.attributes}
                            isEditable={this.props.isEditable}
                            type={this.props.type}
                    />);
    }
});

export default CellValueRenderer;
