import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function FieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.FieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.FieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="FieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
