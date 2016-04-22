/* Defines custom formatters that can be used for customComponents for griddle columns*/
/* TODO: define exclusion in case server has some conflicting attributes -
*    for example for a numeric field server lets you select separator pattern - in that case should we ignore locale?
*
* */
import React from 'react';
import ReactDOM from 'react-dom';
import {I18nDate, I18nNumber} from '../../../utils/i18nMessage';
import {Input} from 'react-bootstrap';
import RowEditActions from './rowEditActions';

export const DateFormatter = React.createClass({
    render: function() {
        let data = "";
        if (this.props.data) { //for griddle
            data = this.props.data;
        } else if (this.props.params.value) { //for ag grid
            data = this.props.params.value;
        }
        if (data !== "") {
            return (
                <span className="cellWrapper">
                        {this.props.params.colDef && this.props.params.colDef.addEditActions &&
                        <RowEditActions flux={this.props.params.context.flux}
                                        api={this.props.params.api}
                                        data={this.props.params.data}/>}
                    <span className="cellData"><I18nDate value={data}/></span></span>);
        }
        return null;
    }
});

export const NumericFormatter = React.createClass({
    render: function() {
        let data = "";
        if (this.props.data) { //for griddle
            data = this.props.data;
        } else if (this.props.params.value) { //for ag grid
            data = this.props.params.value;
        }
        if (data !== "") {
            return <span className="cellWrapper">
                    {this.props.params.colDef && this.props.params.colDef.addEditActions &&
                    <RowEditActions flux={this.props.params.context.flux}
                                    api={this.props.params.api}
                                    data={this.props.params.data}/>}
                <span className="cellData"><I18nNumber value={data}/></span></span>;
        }
        return null;
    }
});

export const TextFormatter = React.createClass({

    getInitialState() {
        return {
            editing: false
        };
    },

    onClickCell() {
        this.setState({editing:!this.state.editing});
        setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.cellInput).focus();
        }, 0);
    },
    onBlurCell() {
        this.setState({editing:false});
    },

    render: function() {
        let data = this.props.params.value;


        if (data) {
            return (<span className="cellWrapper">
                {this.props.params.colDef && this.props.params.colDef.addEditActions &&
                    <RowEditActions flux={this.props.params.context.flux}
                                    api={this.props.params.api}
                                    data={this.props.params.data}/>}
                {!this.state.editing ?
                    <span className="cellData" onClick={this.onClickCell}>{data}</span> :
                    <input ref="cellInput" onBlur={this.onBlurCell} tabIndex="0" className="cellData" type="text"/>
                    }
                </span>);
        }
        if (this.state.editing && this.refs.cellInput) {
            ReactDOM.findDOMNode(this.refs.cellInput).focus();
        }
        return null;
    }
});
