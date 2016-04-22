import React from 'react';
import Fluxxor from 'fluxxor';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Logger from '../../utils/logger';
import FieldChoice from './fieldChoice';

import './sortAndGroup.scss';

let logger = new Logger();

const FieldChoiceList = React.createClass({
    render() {
        //note whether we are at max or not to show and additional blank item
        let showMore = this.props.fields &&
            (this.props.fields.length < this.props.maxLength);

        // the list of selected choices to render
        // items read: by X; then by Y; then by Z
        // 'then' is added on all but first (0 index)
        let listOfSelected = this.props.fields &&
            this.props.fields.map((field, index) =>  {
                return (<FieldChoice type={this.props.type} key={this.props.type + field.name + index} field={field}
                                     then={!!index} />);
            });

        // not if there are existing settings or if this is the first for
        // whether to say 'by last' or 'then by last'
        let notOnlyOne = this.props.fields && this.props.fields.length > 0;

        return (
            <div>
                {listOfSelected}
                {showMore ? <FieldChoice type={this.props.type} then={notOnlyOne}
                                    onShowFields={(type) => this.props.onShowFields(this.props.type)}/> :
                    null}
            </div>
        );
    }
});

export default FieldChoiceList;
