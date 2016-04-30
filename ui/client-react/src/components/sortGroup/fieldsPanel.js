import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import Locale from '../../locales/locales';
import Logger from '../../utils/logger';
import StringUtils from '../../utils/stringUtils';
import {ListGroup, ListGroupItem, Panel} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import './sortAndGroup.scss';

let logger = new Logger();

const FieldsPanel = React.createClass({

    isSelected(id, list) {
        _.find(list, (field) => {
            return field.id === id;
        });
    },


    selectField(type, field) {
        this.props.onSelectField(type, field);
        this.props.onHideFields();
    },

    renderField(field, selected, notInReport) {
        return (
            <ListGroupItem id={field.id}  key={field.id}
                           className={"fieldItem" + (notInReport ?  " animated slideInDown notInReport" : "")}
                           onClick={() => this.selectField(this.props.fieldsForType, field)}>
                <QBicon className={this.props.isSelected  ? "checkMark-selected" : "checkMark"}
                        icon="check" />
                {field.name}</ListGroupItem>
        );
    },

    renderList(orderList, list, type) {
        let restOfFields = null;
        // show "more fields..." for viewing any remaining fields not in report
        if (orderList && orderList.notInReport && orderList.notInReport.length) {
            if (this.props.showNotVisible) {
                restOfFields = orderList.notInReport.map((field) => {
                    return this.renderField(field, this.isSelected(field.id, list), true);
                });
            } else {
                restOfFields = (<ListGroupItem className="moreFields"><span onClick={()=>this.props.showMoreFields(type)} >
                                    <I18nMessage message={"report.sortAndGroup.moreFields"}/>
                                </span></ListGroupItem>);
            }
        }

        return (
                <ListGroup>
                    {(orderList.inReport &&
                            orderList.inReport.map((field) => {
                                return this.renderField(field, this.isSelected(field.id, list), false);
                            }))
                    }
                    {restOfFields}
                </ListGroup>
            );
    },

    renderMockList() {
        return (
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
            </ListGroup>);
    },

    getFieldsInReportOrder(choicesList, usedInReport) {
        //return 2 arrays fields in report in same order as usedInReport and fields not in report
        let answer = {
            inReport:[],
            notInReport:[]
        };

        if (usedInReport) {
            usedInReport.forEach((field) => {
                // add those fields used in report that are available for sorting/grouping to the inReport
                // in the order of the columns
                choicesList.forEach((choicesField) => {
                    if (field.id === choicesField.id) {
                        answer.inReport.push(choicesField);
                    }
                });
            });
        }

        // extract from not used in report list all the fields currently used.
        answer.notInReport =  _.clone(choicesList);
        _.pullAllBy(answer.notInReport, usedInReport, 'id');
        return answer;
    },

    render() {
        let shownClass = this.props.showFields ? '' : 'notShown';
        let currentList =  this.props.fieldsForType === 'group' ? this.props.groupByFields : this.props.sortByFields;
        let choiceList = this.props.fieldChoiceList;
        let orderList = this.getFieldsInReportOrder(choiceList, this.props.reportColumns);
        return (this.props.showFields ?
            <Panel className={"fieldsPanel animated slideInRight" + shownClass}>
                <div className="fieldPanelHeader">
                    <span className="cancel" tabIndex="0" onClick={this.props.onHideFields}>
                        <I18nMessage message="cancel"/>
                    </span>
                    <span>
                        <I18nMessage message={"report.sortAndGroup.chooseFields." + this.props.fieldsForType}/>
                    </span>
                </div>
                {(
                    (window.location.search.includes('mockSort')) ?
                        this.renderMockList() :
                        this.renderList(orderList, currentList, this.props.fieldsForType)
                )}
            </Panel> :
                null
        );
    }
});

export default FieldsPanel;
