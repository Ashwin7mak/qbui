import React from 'react';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {Overlay, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

import FacetsItem from './facetsItem';
import Hicon from '../harmonyIcon/harmonyIcon';

import './facet.scss';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);


var FacetsMenuButton = React.createClass({
    propTypes: {
        reportsData: React.PropTypes.shape({
            list: React.PropTypes.array.isRequired
        }),
        onFacetSelect : React.PropTypes.func
    },

    getInitialState: function() {
        return {
            show: false
        };
    },

    toggleMenu(e) {
        this.setState({target: e.target, show: !this.state.show});
    },

    /**
     * render a facet menu field item and its choices
     **/
    facetsMenu: function(facetsData) {
        return facetsData.list && facetsData.list.map((item, index) => {
            return <FacetsItem key={item.fid}
                               facet={item}
                               onSelect={this.props.onFacetSelect}
                {...this.props} />;
        });
    },

    render() {
        const style = {
            display: 'block',
            position: 'absolute',
            backgroundColor: '#FFF',
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
            border: '1px solid #CCC',
            borderRadius: 3,
            marginLeft: 0,
            marginTop: -10,
            minWidth: 220
        };

        return (
            <div ref="facetsMenuButtonContainer">
                {/* the filter icon */}
                <div className="facetsMenuButton"
                     onClick={e => this.toggleMenu(e)}
                     ref="facetsMenuButton" >
                    <Hicon icon="filter"  />
                </div>

                {/* overlaid list of facet options shown on filter icon click */}
                <Overlay
                    show={this.state.show}
                    onHide={() => this.setState({show: false})}
                    placement="bottom"
                    containerPadding={0}
                    container={this}
                    target={()=> ReactDOM.findDOMNode(this.state.target)}
                    ref="facetsDropdown">

                    {/* arrowed box with contents of the facet menu list of item */}
                    <Popover style={style}
                             id="facetsMenuPopup"
                             className="facetMenuPopup">
                        <div>
                            {this.facetsMenu(this.props.reportData.data.facets)}
                        </div>
                    </Popover>
                </Overlay>
            </div>
            );
    }
});

export default FacetsMenuButton;
