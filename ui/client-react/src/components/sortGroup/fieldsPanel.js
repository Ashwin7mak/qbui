import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Logger from '../../utils/logger';
import StringUtils from '../../utils/stringUtils';
import {ListGroup, ListGroupItem, Panel} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import FieldChoiceList from './fieldChoiceList';
import './sortAndGroup.scss';

let logger = new Logger();

const FieldsPanel = React.createClass({

    render() {
        let shownClass = this.props.showFields ? '' : 'notShown';
        return (this.props.showFields ?
            <Panel className={"fieldsPanel " + shownClass}>
                <div className="fieldPanelHeader">
                    <span className="cancel" tabIndex="0" onClick={this.props.onHideFields}>
                        <I18nMessage message="cancel"/>
                    </span>
                    <span>
                        <I18nMessage message={"report.sortAndGroup.chooseFields." + this.props.fieldsForType}/>
                    </span>
                </div>
                <ListGroup>
                    <ListGroupItem>Item 1</ListGroupItem>
                    <ListGroupItem>Item 2</ListGroupItem>
                    <ListGroupItem>Item 3</ListGroupItem>
                    <ListGroupItem>Item 4</ListGroupItem>
                    <ListGroupItem>Item 5</ListGroupItem>
                    {/* */}
                    <ListGroupItem>Item 6</ListGroupItem>
                    <ListGroupItem>Item 7</ListGroupItem>
                    <ListGroupItem>Item 8</ListGroupItem>
                    <ListGroupItem>Item 9</ListGroupItem>
                    <ListGroupItem>Item 10</ListGroupItem>
                    <ListGroupItem>Item 11</ListGroupItem>
                    <ListGroupItem>Item 12</ListGroupItem>
                    <ListGroupItem>...</ListGroupItem>
                </ListGroup>
            </Panel> :
                null
        );
    }
});

export default FieldsPanel;
