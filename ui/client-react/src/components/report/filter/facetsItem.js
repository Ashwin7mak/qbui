import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './callout.scss';
import './filter.scss';

import Logger from '../../../utils/logger';
import {I18nMessage} from '../../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

import {FacetValues, facetItemValue}  from './FacetValues';



var FacetsItem = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        facet: React.PropTypes.shape({
            fid: React.PropTypes.number.isRequired,
            name: React.PropTypes.string.isRequired,
            values: React.PropTypes.arrayOf(facetItemValue)
        }),
        selectValueHandler: React.PropTypes.func,
    },
    getInitialState: function() {
        return {
            selectedValues: []
        };
    },

    render() {
        return (
                <div className="facet collapsed">
                    <div className="facetFieldName">{this.props.facet.name}</div>
                        {/*TODO check type of facet list, date, boolean currently only handles list of values */}
                        {/* handle the sublists of values each */}
                        <FacetValues {...this.props}/>
                </div>
        );
    }
});
export default FacetsItem;
