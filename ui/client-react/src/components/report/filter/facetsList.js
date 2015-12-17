import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './callout.scss';
import './filter.scss';

import Logger from '../../../utils/logger';
import {I18nMessage} from '../../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

var FacetsList = React.createClass({
    mixins: [FluxMixin],

    getInitialState: function() {
        return {
        };
    },
    render() {
        let classes = 'facetList ' + (this.props.open ? '' : 'collapsed');
        return (
            <div className={classes}>
               <div className="callout border-callout classes">
               {/* handle the sublists of facets each (type dependent)*/}
                <div className="facets ">
                    <div className="facet collapsed">
                        <div className="facetFieldName">Names</div>
                        {/* handle the sublists of values each */}
                        <ul className="facetValues">
                            <li>Item 1</li>
                            <li>Item 2</li>
                            <li>Item 3</li>
                            <li>Item 4</li>
                            <li>Item 5</li>
                        </ul>
                    </div>
                    <div className="facet">
                        <div className="facetFieldName">Types</div>
                        <ul className="facetValues">
                            <li>Item 1</li>
                            <li>Item 2</li>
                            <li>Item 3</li>
                            <li>Item 4</li>
                            <li>Item 5</li>
                            <li>(empty)</li>
                        </ul>
                    </div>
                    <div className="facet ">
                        <div className="facetFieldName">Status</div>
                        <ul className="facetValues">
                            <li>No</li>
                            <li>Yes</li>
                        </ul>
                    </div>
                    <div className="facet collapsed">
                        <div className="facetFieldName">Dates</div>
                        <ul className="facetValues">
                            <li>12/03/2001 - 12/03/2015</li>
                        </ul>
                    </div>
                </div>
                <span className="border-notch notch"></span>
                <span className="notch"></span>
                </div>
            </div>
        );
    }

});
export default FacetsList;
