import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function DateTimeFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.DateTimeFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.DateTimeFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="DateTimeFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
