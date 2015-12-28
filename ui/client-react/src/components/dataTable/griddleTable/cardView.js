import React from 'react';
import Swipeable from 'react-swipeable';
import {Glyphicon} from '../../../../../node_modules/react-bootstrap/lib';
import RecordActions from '../../actions/recordActions';
import './cardView.scss';

const MAX_ACTIONS_RESIZE_WITH = 180; // max width while swiping

let CardView = React.createClass({

    contextTypes: {
        allowCardSelection: React.PropTypes.func,
        onToggleCardSelection: React.PropTypes.func,
        onRowSelected: React.PropTypes.func
    },
    getInitialState() {
        return {
            showMoreCards: false,
            showActions: false,
            swiping:false
        };
    },

    handleMoreCard() {
        this.setState({showMoreCards: !this.state.showMoreCards});
    },

    createField(c, curKey) {
        return (<div key={c} className="field">
            <span className="fieldLabel">{curKey}</span>
            <span className="fieldValue">{this.props.data[curKey]}</span>
        </div>);
    },
    createRow(){
        var fields = [];
        var keys = Object.keys(this.props.data);
        if (!keys.length) {
            return null;
        }
        var topField = <div className="top-card-row field"><strong>{this.props.data[keys[0]]}</strong></div>;
        for (var i = 1; i < keys.length; i++) {

            // ignore metadata columns
            if (this.props.metadataColumns.indexOf(keys[i]) === -1) {
                fields.push(this.createField(i, keys[i]));
            }
        }
        return <div className="card">{topField}<div className={this.state.showMoreCards ? "fieldRow expanded" : "fieldRow collapsed"}>{fields}</div></div>;
    },

    /**
     * swipe in progress
     * @param event
     * @param delta x delta from touch starting position
     */
    swiping(event, delta) {

        if (!this.context.allowCardSelection()) {
            // add delta to current width (MAX_ACTIONS_RESIZE_WITH if open, 0 if closed) to get new size
            this.setState({
                resizeWidth: Math.max(this.state.showActions ? (delta + MAX_ACTIONS_RESIZE_WITH) : delta, 0),
                swiping: true
            });
        }
    },

    swiped() {
        this.setState({
            swiping:false
        });
    },

    swipedLeft(e) {

        if (this.context.allowCardSelection()) {
            this.context.onToggleCardSelection(false);
        } else if (!this.state.showActions) {
            this.setState({
                showActions: true
            });
        }
    },
    swipedRight(e) {

        if (this.state.showActions) {
            this.setState({
                showActions: false
            });
        } else if (!this.context.allowCardSelection()) {
            this.context.onToggleCardSelection(true);
        }
    },
    /* callback when row is selected */
    onRowSelected(e) {
        if (this.context.onRowSelected) {
            this.context.onRowSelected(this.props.data);
        }
    },
    /* close actions when row is clicked */
    onRowClick() {
        this.setState({
            showActions:false
        });
    },
    render() {

        if (this.props.data) {
            let row = this.createRow();

            let actionsStyle = {};
            let rowActionsClasses = "rowActions ";

            if (this.state.swiping) {
                rowActionsClasses += "swiping";
                actionsStyle = {
                    width: Math.min(MAX_ACTIONS_RESIZE_WITH, this.state.resizeWidth)
                };
            } else {
                // not swiping, don't add inline style (width and transitions come from css)
                rowActionsClasses += this.state.showActions ? "open" : "closed";
            }

            return (
                <Swipeable className={"swipeable"} onSwiping={this.swiping} onSwiped={this.swiped} onSwipedLeft={this.swipedLeft} onSwipedRight={this.swipedRight}>

                    <div className={this.state.showMoreCards ? "custom-row-card expanded" : "custom-row-card"}>
                        <div className="flexRow">
                            {this.context.allowCardSelection() && <div className={"checkboxContainer"}><input checked={this.props.data.selected} onChange={this.onRowSelected} type="checkbox"></input></div>}
                            <div className="card">
                                {row}
                            </div>
                            <div className="card-expander" onClick={this.handleMoreCard}>
                                <span className={this.state.showMoreCards ? "chevron_opened" : "chevron_closed"}/>
                            </div>

                        </div>
                    </div>

                    <div ref={"actions"} style={actionsStyle} className={rowActionsClasses}>
                        <RecordActions {...this.props}/>
                    </div>
                </Swipeable>
            );
        } else {
            return null;
        }
    }
});

export default CardView;
