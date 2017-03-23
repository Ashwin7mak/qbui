import React from 'react';

import formBuilderPreview from './formBuilderPreview.png';
import './tableCreationSummaryPanel.scss';

class TableCreationSummaryPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="tableCreationSummary">
                <div className="description">Each bit of information you  want to collect is a field.</div>
                <div className="title">Drag and drop fields you want to add to your table onto the form.  You can arrange the fields in the order you want people to use them.</div>

                <div className="formBuilderPreview"><img src={formBuilderPreview} /></div>
            </div>);
    }
}

export default TableCreationSummaryPanel;
