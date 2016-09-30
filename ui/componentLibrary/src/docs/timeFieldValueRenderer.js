import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TimeFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.TimeFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.TimeFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="TimeFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
