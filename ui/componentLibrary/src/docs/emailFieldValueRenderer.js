import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function EmailFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.EmailFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.EmailFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="EmailFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
