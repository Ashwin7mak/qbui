import React from 'react';
import Logger from '../../utils/logger';
import FieldChoice from './fieldChoice';

import './sortAndGroup.scss';


/**
 * Renders a list of field choices(FieldChoice child component) for sort of group settings for the ordering of a table.
 * It expects the props of the list of field the maxLengh allowed so you can add additional fields to the list up to the
 * max specified. Each field in the list has its field id and field name.
 *
 * The fields available for selection for new items is specified in the fieldChoiceList prop
 *
 * The field is presented with prefix then the field name then the action buttons. When there is only one item the field
 * has the prefix by e.g.:
 * 'by XXXX'
 * where XXX is the field name if there are more fields after that they are prefixed by
 * 'then by ZZZ'
 *
 * if the maxLength is not already reached given the fields list, and single additional blank entry is added to the end
 * of the list with action button for bringing up a fieldselector to add another field to the ordered list
 *
 * @type {ClassicComponentClass<P>}
 */
const FieldChoiceList = React.createClass({
    render() {
        //note whether we are at max or not to show and additional blank item
        let showMore = this.props.fields &&
            (this.props.fields.length < this.props.maxLength);

        // if all the fields id have been used for sorting or grouping
        // don't allow adding a new one
        if (showMore && (!this.props.fieldChoiceList || !this.props.fieldChoiceList.length)) {
            showMore = false;
        }

        // the list of selected choices to render
        // items read: by X; then by Y; then by Z
        // 'then' is added on all but first (0 index)
        let listOfSelected = this.props.fields &&
            this.props.fields.map((field, index) =>  {
                return (<FieldChoice type={this.props.type} key={this.props.type + '_fid' + field.id + '_' + index + '_' + field.name} field={field}
                                     then={!!index} index={index} onSetOrder={this.props.onSetOrder}
                                     onRemoveField={this.props.onRemoveField}
                        />);
            });

        // not if there are existing settings or if this is the first for
        // whether to say 'by last' or 'then by last'
        let notOnlyOne = this.props.fields && this.props.fields.length > 0;

        return (
            <div>
                {listOfSelected}
                {showMore && this.props.onShowFields ?
                    <FieldChoice type={this.props.type} then={notOnlyOne} key={this.props.type + '_fid0_'}
                                    onShowFields={(type) => this.props.onShowFields(this.props.type)}
                    /> :
                    null}
            </div>
        );
    }
});

export default FieldChoiceList;
