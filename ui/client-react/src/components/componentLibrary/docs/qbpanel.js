import React from 'react';

import Metadata from '../src/Metadata';
import ReactPlayground from '../src/ReactPlayground';
import Examples from '../src/Examples';
import PropTable from '../src/PropTable';
import QBPanel from '../../QBPanel/qbpanel';

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
