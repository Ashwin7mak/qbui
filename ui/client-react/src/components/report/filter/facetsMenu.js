import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './callout.scss';
import './filter.scss';

import Logger from '../../../utils/logger';
import {I18nMessage} from '../../../../src/utils/i18nMessage';
import FacetsItem from './FacetsItem';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

var FacetsMenu = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        //TODO
    },
    getInitialState: function() {
        return {
        };
    },

    selectHandler : function() {
    },

    /**
     * render a facet field item and its values
     **/
    facetsMenu: function() {
        return this.props.facetsData.list && this.props.facetsData.list.map((item, index) => {
            return <FacetsItem key={item.fid }
                               facet={item}
                               onSelect={this.props.selectHandler}
                                {...this.props} />;
        });
    },

    render() {
        let classes = 'facetsMenu ' + (this.props.showing ? '' : 'hidden');
        if (this.props.showing) {
            let facets = this.facetsMenu();
            return (
                <div className={classes}>
                    <div className="callout border-callout classes">
                        {/* handle the sublists of facets each (TODO: type dependent)*/}
                        <div className="facets">
                            {facets}
                        </div>
                        <span className="border-notch notch"/>
                        <span className="notch"/>
                    </div>
                </div>
            );
        } else {
            return (<div className={classes}/>);
        }
    }

});
export default FacetsMenu;
