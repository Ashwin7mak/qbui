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
        //handle whether we are at max or not to show and additional blank item
        let showMore = this.props.fields &&
            (this.props.fields.length < this.props.maxLength);

        // the list of selected choices to render
        let listOfSelected = this.props.fields &&
            this.props.fields.map((field, index) =>  {
                return (<FieldChoice type={this.props.type} key={index} field={field}
                                     then={!!index} />);
            });

        let notOnlyOne = this.props.fields && this.props.fields.length > 0;

        return (
            <div>
                {listOfSelected}
                {showMore ? <FieldChoice type={this.props.type} then={notOnlyOne}/> :
                    null}
            </div>
        );
    }
});

export default FieldChoiceList;
