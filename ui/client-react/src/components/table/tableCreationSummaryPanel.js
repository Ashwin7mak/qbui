import React from 'react';
import {I18nMessage} from "../../utils/i18nMessage";
import formBuilderPreview from './formBuilderPreview.png';
import './tableCreationSummaryPanel.scss';

/**
 *
 * @constructor
 */
const TableCreationSummaryPanel = () => {

    return (
        <div className="tableCreationSummary">
            <div className="description"><I18nMessage message="tableCreation.summaryDescription"/></div>
            <div className="title"><I18nMessage message="tableCreation.summaryTitle"/></div>

            <div className="formBuilderPreview"><img src={formBuilderPreview} /></div>
        </div>);
};


export default TableCreationSummaryPanel;
