import React from 'react';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

import FacetsItem from './facetsItem';
import Hicon from '../harmonyIcon/harmonyIcon';

import './facet.scss';

let logger = new Logger();

/*
 FacetsMenuButton component presents a list of facets available to filter the report on when its button is clicked.
 Takes the reportData which includes the list of facets
 and a function to call when a facet value is selected.
 */
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
    facetsMenu(facetsData) {
        return facetsData.list && facetsData.list.map((item, index) => {
            return <FacetsItem key={item.fid}
                               facet={item}
                               selectValueHandler={this.props.onFacetSelect}
                {...this.props} />;
        });
    },
    /**
     * arrowed box with contents of the facet menu list of item
    **/
    facetsPopup() {
        const style = {
            display: 'block',
            position: 'absolute',
            backgroundColor: '#FFF',
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
            border: '1px solid #CCC',
            borderRadius: 3,
            marginLeft: 365,
            marginTop: 20,
            minWidth: 220
        };
        return (
                <Popover style={style}
                     id="facetsMenuPopup"
                     className="facetMenuPopup">
                    <div>
                        {this.props.reportData && this.props.reportData.data && this.props.reportData.data.facets ?
                            this.facetsMenu(this.props.reportData.data.facets) : "No Facets"}
                    </div>
                </Popover>
        );
    },
    render() {
        return (
            <div ref="facetsMenuButtonContainer">
                {/*  list of facet options shown on filter icon click */}
                <OverlayTrigger container={this} trigger="click"
                                placement="bottom" overlay={this.facetsPopup()} >

                    {/* the filter icon */}
                    <div className="facetsMenuButton"
                         onClick={e => this.toggleMenu(e)}
                         ref="facetsMenuButton" >
                        <Hicon icon="filter" />
                    </div>
                 </OverlayTrigger>
            </div>
            );
    }
});

export default FacetsMenuButton;
