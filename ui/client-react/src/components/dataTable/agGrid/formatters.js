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

const TextFormat = 1;
const NumberFormat = 2;
const DateFormat = 3;

const CellEditor = React.createClass({

    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    onBlur() {

    },
    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      onBlur={this.onBlur}
                      tabIndex="0"
                      className="cellData"
                      type="text"
                      value={this.props.value}/>;
    }
});

const CellFormatter = React.createClass({

    propTypes: {
        type: React.PropTypes.number.isRequired,
        params: React.PropTypes.object.isRequired
    },

    getInitialState() {

        return {
            value: this.props.params.value
        };
    },

    renderCell() {

        switch (this.props.type) {
        case NumberFormat:
            return <span className="cellData">
                {this.state.value && <I18nNumber value={this.state.value}></I18nNumber>}
                </span>;

        case DateFormat:
            return <span className="cellData">
                {this.state.value && <I18nDate value={this.state.value}></I18nDate>}
                </span>;

        default:
            return <span className="cellData">
                {this.state.value}
                </span>;
        }
    },


    cellEdited(newValue) {
        this.setState({value: newValue});
    },
    render: function() {

        return (<span className="cellWrapper">
                {this.props.params.colDef && this.props.params.colDef.addEditActions &&
                <RowEditActions flux={this.props.params.context.flux}
                                api={this.props.params.api}
                                data={this.props.params.data}

                />}
                {this.renderCell()}
                <CellEditor value={this.state.value} onChange={this.cellEdited} />
                </span>);

    }
});

export const DateFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateFormat} params={this.props.params} />;
    }
});

export const NumericFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={NumberFormat} params={this.props.params}/>;
    }
});

export const TextFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={TextFormat} params={this.props.params} />;
    }
});
