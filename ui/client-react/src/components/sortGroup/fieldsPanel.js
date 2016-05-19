import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import Logger from '../../utils/logger';
import {ListGroup, ListGroupItem, Panel} from 'react-bootstrap';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import QBicon from '../qbIcon/qbIcon';
import './sortAndGroup.scss';


/**
 * Renders a panel showing a list of field names, when one is clicked on the panel closes and the
 * onSelectField callback is called if specified, also then calls the onHideFields callback
 * allowing the user to click to select a field at a time
 *
 * The list will show the fields in the fieldChoiceList property that are not in either the groupByFields
 * nor sortByFields list,
 *
 * @type {ClassicComponentClass<P>}
 */
const FieldsPanel = React.createClass({

    propTypes : {
        //sort or group
        fieldsForType:React.PropTypes.string,

        //boolean for whether this panel should show or not
        showFields:React.PropTypes.bool,

        // the list of fields already in use in group by
        groupByFields:React.PropTypes.array,

        // the list of fields already in use in sort by
        sortByFields:React.PropTypes.array,

        // the remaining list of fields available to choice from'
        // per spec if field is already in use for sorting or for grouping its not
        // able to be reselected for sort of group
        fieldChoiceList:React.PropTypes.array,

        // the list of fields visible as columns in the report
        // we use to show the fields list of visible fields first before fields not show in report
        reportColumns:React.PropTypes.array,

        // the list of fields visible as groups in the report
        // we use to show the fields list of visible fields first before fields not show in report
        visGroupEls:React.PropTypes.array,

        //if true show fields that are not visible in the report,
        //if false use 'see more' for fields that are not in the report
        showNotVisible:React.PropTypes.bool,

        // the callback that is used when a field is selected to add to the list for sort or grouping
        // new selection, pass type string 'sort' or 'group' parameter
        onSelectField:React.PropTypes.func,

        // the callback that is used when ready to close/hide the fields list after selecting a field
        onHideFields:React.PropTypes.func,

        // the callback used to show the fields not visible in the report
        onShowMoreFields:React.PropTypes.func,
    },

    isSelected(id, list) {
        _.find(list, (field) => {
            return field.id === id;
        });
    },


    selectField(type, field) {
        if (this.props.onSelectField && field) {
            this.props.onSelectField(type, field);
        }
        if (this.props.onHideFields) {
            this.props.onHideFields();
        }
    },

    renderField(field, selected, notInReport) {
        return (
            <ListGroupItem id={field.id}  key={field.id}
                           className={"action fieldItem" + (notInReport ?  " animated slideInDown notInReport" : "")}
                           onClick={() => this.selectField(this.props.fieldsForType, field)}>
                {field.name}</ListGroupItem>
        );
    },

    renderList(orderList, list) {
        let restOfFields = null;
        // show "more fields..." for viewing any remaining fields not in report
        if (orderList && orderList.notInReport && orderList.notInReport.length) {
            if (this.props.showNotVisible) {
                restOfFields = orderList.notInReport.map((field) => {
                    return this.renderField(field, this.isSelected(field.id, list), true);
                });
            } else {
                restOfFields = (<ListGroupItem className="action moreFields" onClick={this.props.onShowMoreFields}>
                                    <span>
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

    // for mocking data and seeing edge cases of renders
    // add ?mockSort=true to the url to use mockSort data
    renderMockList(count) {
        function oneMockItem(owner, num) {
            return (<ListGroupItem key={num} onClick={owner.selectField}>Item {num}</ListGroupItem>);
        }

        let items = [];
        for (let i = 1; i <= count; i++) {
            items.push(oneMockItem(this, i));
        }
        return (
            <ListGroup>{items}</ListGroup>
           );
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
        let type = this.props.fieldsForType ? this.props.fieldsForType : 'group';
        let currentList =  type === 'group' ? this.props.groupByFields : this.props.sortByFields;
        let choiceList = this.props.fieldChoiceList;

        //add group by fields to fields used in report columns
        let visibleFields = _.unionBy(this.props.visGroupEls, this.props.reportColumns, 'id');
        let orderList = this.getFieldsInReportOrder(choiceList, visibleFields);
        return (this.props.showFields ?
            <Panel className={"fieldsPanel animated slideInRight" + shownClass}
                   ref="fieldsPanel" key={"fieldsPanel" + this.props.showFields}>
                <div className="fieldPanelHeader">
                    <span className="action cancel" tabIndex="0" onClick={this.props.onHideFields}>
                        <I18nMessage message="cancel"/>
                    </span>
                    <span>
                        <I18nMessage message={"report.sortAndGroup.chooseFields." +
                                    type}/>
                    </span>
                </div>
                {(
                    (WindowLocationUtils.searchIncludes('mockSort')) ?
                        this.renderMockList(12) :
                        this.renderList(orderList, currentList)
                )}
            </Panel> :
                null
        );
    }
});

export default FieldsPanel;
