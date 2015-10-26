import React from 'react';

//import ReactBootstrap from 'react-bootstrap';
import {Glyphicon} from '../../../../../node_modules/react-bootstrap/lib';

import './cardView.scss';

class CardView extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
        this.handleMoreCard = this.handleMoreCard.bind(this);
    }

    initState() {
        let initialState = {
            showMoreCards: false
        };
        return initialState;
    }

    handleMoreCard() {
        this.setState({showMoreCards: !this.state.showMoreCards});
    }


    createField(c, curKey) {
        return (<div key={c} className="field">
            <span className="fieldLabel">{curKey}</span>
            <span className="fieldValue">{this.props.data[curKey]}</span>
        </div>);
    }
    createRow(){
        var fields = [];
        var keys = Object.keys(this.props.data);
        var topField = <div className="top-card-row field"><strong>{this.props.data[keys[0]]}</strong></div>;
        for (var i = 1; i < keys.length; i++) {
            fields.push(this.createField(i, keys[i]));
        }
        return <div className="card">{topField}<div className={this.state.showMoreCards ? "fieldRow expanded" : "fieldRow collapsed"}>{fields}</div></div>;
    }


    render(){
        var row = this.createRow();
        return (
            <div className="custom-row-card">
                <div className="flexRow">
                    <div className={this.state.showMoreCards ? "card expanded" : "card collapsed"}>
                        {row}
                    </div>
                    <div className="card-expander" onClick={this.handleMoreCard}>
                        <Glyphicon glyph="plus"/>
                    </div>
                </div>
            </div>
        );
    }

}

export default CardView;
