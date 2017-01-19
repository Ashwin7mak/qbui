import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function QbGridDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.QbGrid.descHtml}} />

            <ReactPlayground codeText={Examples.QbGrid} />

            <h2>Props</h2>
            <PropTable component="QbGrid" metadata={Metadata} />
        </div>
    );
}
