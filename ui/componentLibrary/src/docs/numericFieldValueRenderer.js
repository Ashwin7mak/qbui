import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function NumericFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.NumericFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.NumericFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="NumericFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
