import React from 'react';
import ReactDOM from 'react-dom';

import {Overlay} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import QBicon from '../qbIcon/qbIcon';
import LimitConstants from './../../../../common/src/limitConstants';

import './sortAndGroup.scss';

import SortAndGroupDialog from './sortAndGroupDialog';
import thwartClickOutside from '../hoc/thwartClickOutside';
import closeOnEscape from '../hoc/catchEscapeKey';


import _ from 'lodash';
import Fluxxor from 'fluxxor';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 *  SortAndGroup container component manages the state and presents the components that are :
 *  a trigger button that when clicked shows the panel of options for sorting and grouping
 *  When the panel is shown and the trigger button is clicked again it hides the panel.
 *
**/
const SortAndGroup = React.createClass({
    mixins: [FluxMixin],
    //mixins: [FluxMixin, StoreWatchMixin('SortAndGroupStore')],

    displayName: 'SortAndGroup',
    contextTypes: {
        touch: React.PropTypes.bool
    },
    buttonNode : null,

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of fields
         *  and a function to call when a sort group options are applied
         **/
        reportData: React.PropTypes.shape({
            sortFids: React.PropTypes.shape,

        }),
        onSortGroupApply : React.PropTypes.func,
        onMenuEnter : React.PropTypes.func,
        onMenuExit : React.PropTypes.func
    },

    getInitialState: function() {
        return {show: false};
    },

    toggleShow: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:!this.state.show});
        this.setState({show: !this.state.show});
    },

    hide: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:false});
        this.setState({show: false});
    },

    show: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:true});
        this.setState({show: true});
    },

    getStateFromFlux() {
        //let flux = this.getFlux();
        //return flux.store('SortAndGroupStore').getState();
        return {show: false};
    },


    // return true if event.target or its parent is
    // the sort button
    isButton(evt) {
        let answer = false;
        let localButtonNode = this.refs.SortAndGroupButton;
        if (evt && evt.target && localButtonNode) {
            let target = evt.target;
            while (target.parentNode) {
                answer = (target === localButtonNode);
                if (answer) {
                    break;
                }
                target = target.parentNode;
            }
        }
        return answer;
    },


    /**
     * Prepares the menu button used to show/hide the dialog of sort and group options when clicked
     *
     **/
    render() {
        let flux = this.getFlux();

        // wrap the sort dialog in additional functionality to close the dialog on escape
        // and to not handle any outside clicks while the dialog is open
        let SortAndGroupDialogWrapped = closeOnEscape(thwartClickOutside(
                            SortAndGroupDialog, (e) => this.isButton(e)));


        return (
            <div ref="sortAndGroupContainer" className="sortAndGroupContainer">

                {/* the sort/group icon button */}
                <div className={"sortAndGroupButton " +
                            (this.state.show ? "shown " : "") }
                     ref="SortAndGroupButton"
                     >
                    <span className="sortButtonSpan" tabIndex="0"  onClick={() => this.toggleShow()}>
                        <QBicon className="sortButton" icon="sort-az" />
                    </span>
                </div>


                {/* options shown when icon clicked */}
                <Overlay container={this} placement="bottom"
                         show={this.state.show}
                         onClose={() => this.hide()}
                         onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit} >
                    <SortAndGroupDialogWrapped  show={this.state.show}
                                                reportData={this.props.reportData}
                                                onClose={() => this.hide()}/>
                </Overlay>
            </div>
        );
    }
});

export default SortAndGroup;
