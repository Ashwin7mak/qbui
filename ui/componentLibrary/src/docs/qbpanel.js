import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function QBPanelDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.QBPanel.descHtml}} />

            <ReactPlayground codeText={Examples.QBPanel}/>

            <h2>Props</h2>
            <PropTable component="QBPanel" metadata={Metadata} />
        </div>
    );
}
