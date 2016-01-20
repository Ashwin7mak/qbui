import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';
import {MenuItem} from 'react-bootstrap';

import './unused/callout.scss';
import './filter.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

const facetItemValue = React.PropTypes.shape({
    value: React.PropTypes.string
});

var FacetValues = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        facet: React.PropTypes.shape({
            fid: React.PropTypes.number.isRequired,
            values: React.PropTypes.arrayOf(facetItemValue)
        }),
        selectValueHandler: React.PropTypes.func,
    },

    render() {
        /* handle the sublists of values each */
        return (
        this.props.facet.values && this.props.facet.values.map((item, index) => {
            return <MenuItem key={this.props.facet.fid + "." + index}
                       onSelect={this.props.selectValueHandler}>
                {item.value}
            </MenuItem>;
        })
    );
    }
});
exports.FacetValues = FacetValues;
exports.facetItemValue = facetItemValue;
